const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin, isAuthenticatedAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");
const Bid = require("../model/bid");

// create new order
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo, orderType, bidId } = req.body;

      //   group cart items by shopId
      const shopItemsMap = new Map();

      for (const item of cart) {
        const shopId = item.shopId || (item.shop && item.shop._id);
        if (!shopId) continue;

        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }

        // Format cart item according to new schema
        const formattedItem = {
          item: item.item || item,
          shopId: shopId,
          qty: item.qty || 1,
          price: item.price || item.discountPrice || item.originalPrice
        };

        shopItemsMap.get(shopId).push(formattedItem);
      }

      // create an order for each shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        // Determine the order type
        let finalOrderType = orderType || 'cart';

        // If not explicitly set, check items for auction or buy now
        if (!orderType) {
          const hasAuctionItem = items.some(item =>
            item.item.isAuctionItem ||
            item.item.auctionItem
          );
          const hasBidItem = items.some(item =>
            item.item.isBidding ||
            item.item.bidding
          );

          if (hasAuctionItem) {
            finalOrderType = 'auction';
          } else if (hasBidItem) {
            finalOrderType = 'bid';
          }
        }

        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
          orderType: finalOrderType,
          bidId: bidId
        });
        orders.push(order);

        // Update product stock and sold out count
        for (const item of items) {
          await updateOrder(item.item._id, item.qty);
        }
      }

      // If this order originated from a bid, mark the bid as completed
      if (bidId) {
        await Bid.findByIdAndUpdate(bidId, {
          status: "completed",
          isCheckedOut: true
        });
      }

      res.status(201).json({
        success: true,
        orders,
      });

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);
        if (product) {
          product.stock -= qty;
          product.sold_out += qty;
          await product.save({ validateBeforeSave: false });
        }
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of user
router.get(
  "/get-all-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({
        $or: [
          { "user._id": req.params.userId },
          { "user": req.params.userId }
        ]
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of seller
router.get(
  "/get-seller-all-orders",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.seller.id;

      console.log("Fetching orders for shop ID:", shopId);

      // Find all orders first
      const orders = await Order.find().sort({
        createdAt: -1,
      });

      // Process orders to include only items for this shop
      const processedOrders = orders.map(order => {
        const orderObj = order.toObject();
        // Filter cart items to only include those for this shop
        const shopItems = orderObj.cart.filter(item => {
          // Get the shop ID from the item that uploaded the product
          const itemShopId = item.shopId ||
            (item.shop && item.shop._id) ||
            (item.item && item.item.shop && item.item.shop._id) ||
            (item.item && item.item.shopId);

          // Convert both IDs to string for comparison
          return String(itemShopId) === String(shopId);
        });

        // Calculate shop-specific totals
        const shopTotal = shopItems.reduce((total, item) => {
          const itemQty = item.qty || 1;
          const itemPrice = item.price || 0;
          return total + (itemPrice * itemQty);
        }, 0);

        // Keep all orders, but mark which ones have items from this shop
        orderObj.cart = shopItems;
        orderObj.shopItemsQty = shopItems.reduce((total, item) => total + (item.qty || 1), 0);
        orderObj.shopTotal = shopTotal;
        orderObj.hasShopItems = shopItems.length > 0;
        return orderObj;
      });

      // Filter and only return orders that belong to this shop
      const shopOrders = processedOrders.filter(o => o.hasShopItems);

      res.status(200).json({
        success: true,
        orders: shopOrders,
      });
    } catch (error) {
      console.error("Error fetching shop orders:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update order status for seller
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }
      if (req.body.status === "Transferred to delivery partner") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      order.status = req.body.status;

      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "Succeeded";
        const serviceCharge = order.totalPrice * .10;
        await updateSellerInfo(order.totalPrice - serviceCharge);
      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
      });

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock -= qty;
        product.sold_out += qty;

        await product.save({ validateBeforeSave: false });
      }

      async function updateSellerInfo(amount) {
        const seller = await Shop.findById(req.seller.id);

        seller.availableBalance = amount;

        await seller.save();
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update order status after checkout
router.put(
  "/update-order-status-after-checkout/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = "Completed";
      order.paymentStatus = "Succeeded";

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// give a refund ----- user
router.put(
  "/order-refund/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// accept the refund ---- seller
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save();

      res.status(200).json({
        success: true,
        message: "Order Refund successfull!",
      });

      if (req.body.status === "Refund Success") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock += qty;
        product.sold_out -= qty;

        await product.save({ validateBeforeSave: false });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all orders --- for admin
router.get(
  "/admin-all-orders",
  isAuthenticatedAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get sales stats for shop chart
router.get(
  "/get-shop-sales-stats",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.seller.id;

      const orders = await Order.find({
        status: "Delivered",
        "cart.shopId": shopId
      });

      const weeklyData = [
        { month: "Mon", sales: 0 },
        { month: "Tue", sales: 0 },
        { month: "Wed", sales: 0 },
        { month: "Thu", sales: 0 },
        { month: "Fri", sales: 0 },
        { month: "Sat", sales: 0 },
        { month: "Sun", sales: 0 },
      ];

      const monthlyData = [
        { month: "Week 1", sales: 0 },
        { month: "Week 2", sales: 0 },
        { month: "Week 3", sales: 0 },
        { month: "Week 4", sales: 0 },
      ];

      const yearlyData = [];
      const currentYear = new Date().getFullYear();
      for (let i = 4; i >= 0; i--) {
        yearlyData.push({ month: (currentYear - i).toString(), sales: 0 });
      }

      orders.forEach((order) => {
        // Only count the portion of the total price that belongs to this shop
        const shopTotal = order.cart.reduce((acc, item) => {
          if (String(item.shopId) === String(shopId)) {
            return acc + (item.price * item.qty);
          }
          return acc;
        }, 0);

        const orderDate = new Date(order.deliveredAt || order.createdAt);
        const now = new Date();

        // Weekly (Last 7 days)
        const diffDays = Math.ceil(Math.abs(now - orderDate) / (1000 * 60 * 60 * 24));
        if (diffDays <= 7) {
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const dayName = days[orderDate.getDay()];
          const dayIndex = weeklyData.findIndex(d => d.month === dayName);
          if (dayIndex !== -1) weeklyData[dayIndex].sales += shopTotal;
        }

        // Monthly (Current Month)
        if (orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear()) {
          const dayOfMonth = orderDate.getDate();
          if (dayOfMonth <= 7) monthlyData[0].sales += shopTotal;
          else if (dayOfMonth <= 14) monthlyData[1].sales += shopTotal;
          else if (dayOfMonth <= 21) monthlyData[2].sales += shopTotal;
          else monthlyData[3].sales += shopTotal;
        }

        // Yearly (Last 5 years)
        const year = orderDate.getFullYear();
        const yearIndex = yearlyData.findIndex(d => d.month === year.toString());
        if (yearIndex !== -1) yearlyData[yearIndex].sales += shopTotal;
      });

      res.status(200).json({
        success: true,
        stats: {
          weekly: weeklyData,
          monthly: monthlyData,
          yearly: yearlyData
        }
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
