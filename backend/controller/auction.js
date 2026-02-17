const Product = require("../model/product");
const Order = require("../model/order"); // Assuming Order model is defined in this file
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated } = require("../middleware/auth");

// Get all active auctions
exports.getAllActiveAuctions = catchAsyncErrors(async (req, res, next) => {
  try {
    const auctions = await Product.find({
      isAuction: true,
      auctionEnded: false,
      auctionEndTime: { $gt: new Date() }
    }).populate("shop", "name");

    res.status(200).json({
      success: true,
      products: auctions,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get auction details by ID
exports.getAuctionById = catchAsyncErrors(async (req, res, next) => {
  try {
    const auction = await Product.findOne({
      _id: req.params.id,
      isAuction: true
    }).populate("shop", "name");

    if (!auction) {
      return next(new ErrorHandler("Auction not found", 404));
    }

    res.status(200).json({
      success: true,
      auction,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get user's active bids
exports.getUserActiveBids = catchAsyncErrors(async (req, res, next) => {
  try {
    const products = await Product.find({
      isAuction: true,
      auctionEnded: false,
      "bids.bidder": req.user._id
    });

    res.status(200).json({
      success: true,
      bids: products.map(product => ({
        product: {
          _id: product._id,
          name: product.name,
          images: product.images,
        },
        currentPrice: product.currentPrice,
        myBid: product.bids.find(bid => bid.bidder.toString() === req.user._id.toString()).amount,
        endTime: product.auctionEndTime
      }))
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get user's won auctions
exports.getUserWonAuctions = catchAsyncErrors(async (req, res, next) => {
  try {
    const wonAuctions = await Product.find({
      isAuction: true,
      auctionEnded: true,
      "winningBid.bidder": req.user._id
    });

    res.status(200).json({
      success: true,
      auctions: wonAuctions
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Check and end expired auctions (can be called by a cron job)
exports.checkAndEndExpiredAuctions = catchAsyncErrors(async (req, res, next) => {
  try {
    const expiredAuctions = await Product.find({
      isAuction: true,
      auctionEnded: false,
      auctionEndTime: { $lte: new Date() }
    });

    for (const auction of expiredAuctions) {
      if (auction.bids.length > 0) {
        const highestBid = auction.bids[auction.bids.length - 1];
        auction.winningBid = highestBid;
        auction.auctionEnded = true;
        await auction.save();

        // Create an order for the winning bid
        const order = await Order.create({
          cart: [{
            item: auction,
            price: highestBid.amount,
            qty: 1,
            isAuctionItem: true
          }],
          shippingAddress: highestBid.shippingAddress,
          user: highestBid.bidder,
          totalPrice: highestBid.amount,
          orderType: 'auction',
          paymentInfo: {
            type: 'auction',
            status: 'pending'
          }
        });
      } else {
        auction.auctionEnded = true;
        await auction.save();
      }
    }

    res.status(200).json({
      success: true,
      message: `${expiredAuctions.length} auctions ended`
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
