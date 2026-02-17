const Product = require("../model/product");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isSeller, isAuthenticated, isAdmin, isAuthenticatedAdmin } = require("../middleware/auth");
const cloudinary = require("cloudinary");
const upload = require("../middleware/upload");
const Order = require("../model/order"); // Import Order model
const sendMail = require("../utils/sendMail"); // Import sendMail function
const router = express.Router();
const fs = require("fs");
const path = require("path");

// create product
router.post(
  "/create-product",
  isSeller,
  upload.array("images", 5), // limit to 5 images
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.seller._id;
      console.log("Looking for shop with ID:", shopId);

      const shop = await Shop.findById(shopId);

      if (!shop) {
        console.log("Shop not found with ID:", shopId);
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      }

      console.log("Found shop:", shop.name);

      // Handle image uploads
      const imagesLinks = [];

      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          const fileUrl = `http://localhost:8000/uploads/${file.filename}`;
          imagesLinks.push({
            public_id: file.filename,
            url: fileUrl,
          });
        });
      } else {
        return next(new ErrorHandler("Please provide at least one product image!", 400));
      }

      console.log("Successfully uploaded images:", imagesLinks);

      const productData = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        tags: req.body.tags,
        originalPrice: req.body.originalPrice,
        discountPrice: req.body.discountPrice,
        stock: req.body.stock,
        images: imagesLinks,
        shop: shop._id,  // Just set the shop ID reference
        isAuction: req.body.isAuction === 'true',
      };

      if (productData.isAuction) {
        productData.startingPrice = req.body.startingPrice;
        productData.currentPrice = req.body.startingPrice; // Set initial current price
        productData.incrementValue = req.body.incrementValue;
        productData.auctionStartTime = new Date(); // Set auction start time to now
        productData.auctionEndTime = req.body.auctionEndTime;
        if (req.body.buyNowPrice) {
          productData.buyNowPrice = req.body.buyNowPrice;
        }
        productData.bids = []; // Initialize empty bids array
      }

      console.log("Creating product with data:", {
        name: productData.name,
        shop: productData.shop,
        images: productData.images.length
      });

      const product = await Product.create(productData);

      // Populate the shop details
      await product.populate('shop', 'name avatar ratings description createdAt averageRating');

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      return next(new ErrorHandler(error.message || "Error creating product", 500));
    }
  })
);


// update product
router.put(
  "/update-product/:id",
  upload.array("images", 5), // limit to 5 images
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log(`[UpdateProduct] Request received for ID: ${req.params.id}`);
      let product = await Product.findById(req.params.id);

      if (!product) {
        console.log(`[UpdateProduct] Product not found for ID: ${req.params.id}`);
        return next(new ErrorHandler("Product not found", 404));
      }

      console.log(`[UpdateProduct] Found product: ${product.name}`);

      // Handle image updates
      let imagesLinks = [];

      // If new images are uploaded
      if (req.files && req.files.length > 0) {
        console.log(`[UpdateProduct] Processing ${req.files.length} new images`);

        // Delete old images from local storage
        if (product.images && product.images.length > 0) {
          product.images.forEach((img) => {
            const filename = img.public_id;
            const filePath = path.join(__dirname, "../uploads", filename);

            // Generate full path and verify it exists before trying to delete
            try {
              if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                  if (err) console.log(`[UpdateProduct] Error deleting old image ${filename}:`, err);
                  else console.log(`[UpdateProduct] Deleted old image: ${filename}`);
                });
              } else {
                console.log(`[UpdateProduct] Old image file not found at: ${filePath}`);
              }
            } catch (fsError) {
              console.log(`[UpdateProduct] Exception dealing with file ${filePath}:`, fsError);
            }
          });
        }

        // Upload new images
        req.files.forEach((file) => {
          const fileUrl = `http://localhost:8000/uploads/${file.filename}`;
          imagesLinks.push({
            public_id: file.filename,
            url: fileUrl,
          });
        });
        console.log(`[UpdateProduct] New image links generated`);
      } else {
        // Keep existing images if no new ones provided
        console.log(`[UpdateProduct] No new images uploaded, keeping existing.`);
        imagesLinks = product.images;
      }

      console.log(`[UpdateProduct] Preparing update data...`);
      const productData = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        tags: req.body.tags,
        originalPrice: req.body.originalPrice,
        discountPrice: req.body.discountPrice,
        stock: req.body.stock,
        images: imagesLinks,
        isAuction: req.body.isAuction === 'true' || req.body.isAuction === true,
      };

      // Handle Auction specific updates if it's an auction product
      if (productData.isAuction) {
        if (req.body.startingPrice) productData.startingPrice = req.body.startingPrice;
        if (req.body.auctionEndTime) productData.auctionEndTime = req.body.auctionEndTime;
        if (req.body.incrementValue) productData.incrementValue = req.body.incrementValue;
        if (req.body.buyNowPrice) productData.buyNowPrice = req.body.buyNowPrice;
      }

      console.log(`[UpdateProduct] Updating in database...`);

      product = await Product.findByIdAndUpdate(req.params.id, productData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });

      console.log(`[UpdateProduct] Update successful.`);

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error(`[UpdateProduct] CRITICAL ERROR:`, error);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// get all products of a shop (secured)
router.get(
  "/get-all-shop-products",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shop: req.seller.id }).sort({ createdAt: -1 }).populate('shop', 'name avatar ratings description createdAt averageRating');

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ isBuyerRequest: { $ne: true } }).sort({ createdAt: -1 }).populate('shop', 'name avatar ratings description createdAt averageRating');

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// get all products of a shop
router.get(
  "/get-all-products/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shop: req.params.id }).populate('shop', 'name avatar ratings description createdAt averageRating');

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete product
router.delete(
  "/product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
      }

      // Delete images from local storage
      for (let i = 0; i < product.images.length; i++) {
        const filename = product.images[i].public_id;
        const filePath = path.join(__dirname, "../uploads", filename);

        fs.unlink(filePath, (err) => {
          if (err) console.log("Error deleting file:", err);
        });
      }

      // Use deleteOne instead of remove
      await Product.deleteOne({ _id: req.params.id });

      res.status(200).json({
        success: true,
        message: "Product deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete product of a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return next(new ErrorHandler("Product is not found with this id", 404));
      }

      if (String(product.shop) !== String(req.seller.id)) {
        return next(new ErrorHandler("You are not authorized to delete this product!", 403));
      }

      // Delete images from local storage
      for (let i = 0; i < product.images.length; i++) {
        const filename = product.images[i].public_id;
        const filePath = path.join(__dirname, "../uploads", filename);

        fs.unlink(filePath, (err) => {
          if (err) console.log("Error deleting file:", err);
        });
      }

      await Product.deleteOne({ _id: req.params.id });

      res.status(201).json({
        success: true,
        message: "Product Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// get single product
router.get(
  "/get-product/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id).populate('shop', 'name avatar ratings description createdAt averageRating');
      if (!product) {
        return next(new ErrorHandler("Product is not found with this id", 404));
      }

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId } = req.body;

      const product = await Product.findById(productId);

      if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
      }

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      // After updating product ratings, update the overall shop rating
      const shopId = product.shop;
      const allProducts = await Product.find({ shop: shopId });

      let totalShopReviews = 0;
      let totalShopRatingSum = 0;

      allProducts.forEach((p) => {
        p.reviews.forEach((rev) => {
          totalShopRatingSum += rev.rating;
          totalShopReviews += 1;
        });
      });

      const shopAverageRating = totalShopReviews > 0 ? totalShopRatingSum / totalShopReviews : 0;

      await Shop.findByIdAndUpdate(shopId, {
        averageRating: shopAverageRating
      });

      res.status(200).json({
        success: true,
        message: "Reviewed successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// buy now for auction product
router.post(
  "/buy-now",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { productId } = req.body;
      const product = await Product.findById(productId);

      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      if (!product.isAuction) {
        return next(new ErrorHandler("This is not an auction product", 400));
      }

      if (!product.buyNowPrice) {
        return next(new ErrorHandler("This product does not have a buy now option", 400));
      }

      if (product.auctionEnded) {
        return next(new ErrorHandler("Auction has ended", 400));
      }

      // Create order
      const order = await Order.create({
        cart: [{
          name: product.name,
          description: product.description,
          price: product.buyNowPrice,
          quantity: 1,
          image: product.images[0],
          productId: product._id,
          shop: product.shop,
        }],
        shippingAddress: req.user.addresses[0], // Use first address as default
        user: req.user,
        totalPrice: product.buyNowPrice,
        status: "Processing",
      });

      // Update product status
      product.auctionEnded = true;
      product.sold_out += 1;
      await product.save();

      // Send notification to seller
      try {
        const shop = await Shop.findById(product.shop).populate('email');
        if (shop && shop.email) {
          await sendMail({
            email: shop.email,
            subject: "Product Sold - Buy Now",
            message: `Your product ${product.name} has been purchased using Buy Now for Rs${product.buyNowPrice}`,
          });
        }
      } catch (emailError) {
        console.log("Error sending email:", emailError);
      }

      res.status(201).json({
        success: true,
        orderId: order._id,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all products --- for admin
router.get(
  "/admin-all-products",
  isAuthenticatedAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      }).populate('shop', 'name avatar ratings description createdAt averageRating');
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// create buyer request (auction)
router.post(
  "/create-request",
  isAuthenticated,
  upload.array("images", 5),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const imagesLinks = [];

      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          const fileUrl = `http://localhost:8000/uploads/${file.filename}`;
          imagesLinks.push({
            public_id: file.filename,
            url: fileUrl,
          });
        });
      } else {
        // Fallback if no files are uploaded, though frontend should prevent this.
        // Or if base64 logic was intended, we might need a different approach,
        // but local storage consistency is preferred.
      }

      const productData = req.body;
      productData.images = imagesLinks;
      productData.user = req.user._id;
      productData.isAuction = true;
      productData.isBuyerRequest = true;

      // Handle Auction specific fields
      productData.startingPrice = req.body.startingPrice;
      productData.currentPrice = req.body.startingPrice;
      productData.incrementValue = req.body.incrementValue;
      productData.auctionStartTime = new Date();
      productData.auctionEndTime = req.body.auctionEndTime;
      productData.bids = [];

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all buyer requests
router.get(
  "/get-buyer-requests",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ isBuyerRequest: true }).sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get user's buyer requests
router.get(
  "/my-requests",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ user: req.user._id, isBuyerRequest: true }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
