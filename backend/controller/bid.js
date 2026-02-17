const express = require("express");
const Bid = require("../model/bid");
const Shop = require("../model/shop");
const Product = require("../model/product");
const User = require("../model/user"); // Ensure User model is imported
const { isAuthenticated } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail");

// Create a new bid
exports.createBid = catchAsyncErrors(async (req, res, next) => {
  try {
    const { productId, bidAmount } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    // Check if auction has ended
    if (product.auctionEnded || new Date() > product.auctionEndTime) {
      return next(new ErrorHandler("Auction has ended", 400));
    }

    // Check if bid amount is valid
    const currentHighestBid = product.currentPrice || product.startingPrice;
    const minBidAmount = currentHighestBid + product.incrementValue;

    if (bidAmount < minBidAmount) {
      return next(new ErrorHandler(`Bid amount must be at least ${minBidAmount}`, 400));
    }

    // Create bid
    const bid = await Bid.create({
      product: productId,
      buyer: req.user._id,
      seller: product.shop,
      bidder: req.user._id,
      bidderType: 'User',
      bidAmount,
    });

    // Update product's current price
    product.currentPrice = bidAmount;
    product.bids.push({
      bidder: req.user._id,
      bidderType: 'User',
      amount: bidAmount,
      time: new Date()
    });
    await product.save();

    try {
      // Send email notification to seller
      const shop = await Shop.findById(product.shop).populate('email');
      if (shop && shop.email) {
        const mailData = {
          email: shop.email,
          subject: `New Bid: Rs.${bidAmount} for ${product.name}`,
          html: `
Dear ${shop.name},

You have received a new bid for your product:

Product: ${product.name}
Bid Amount: Rs.${bidAmount}
Bidder: ${req.user.name}
Time: ${new Date().toLocaleString()}

Current Status:
- Starting Price: Rs.${product.startingPrice}
- Current Highest Bid: Rs.${bidAmount}
- Total Bids: ${product.bids.length}

Auction End Time: ${new Date(product.auctionEndTime).toLocaleString()}

You can view the auction details by logging into your seller dashboard.

Best regards,
BLoved Bidding Team
          `,
        };
        await sendMail(mailData);
      }

      // Notify previous highest bidder
      if (product.bids.length > 1) {
        const previousBidder = await User.findById(product.bids[product.bids.length - 2].bidder);
        if (previousBidder && previousBidder.email) {
          const mailData = {
            email: previousBidder.email,
            subject: `Outbid Alert: ${product.name}`,
            html: `
Dear ${previousBidder.name},

Someone has placed a higher bid on the item you were bidding on:

Product: ${product.name}
New Bid Amount: Rs.${bidAmount}
Your Previous Bid: Rs.${product.bids[product.bids.length - 2].amount}
Time: ${new Date().toLocaleString()}

Auction Details:
- Current Highest Bid: Rs.${bidAmount}
- Auction Ends: ${new Date(product.auctionEndTime).toLocaleString()}

Don't miss out! Place a new bid now to stay in the competition.

Best regards,
BLoved Bidding Team
            `,
          };
          await sendMail(mailData);
        }
      }
    } catch (emailError) {
      console.log("Error sending email:", emailError);
    }

    res.status(201).json({
      success: true,
      bid,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get all bids for a product
exports.getProductBids = catchAsyncErrors(async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    const bids = await Bid.find({ product: req.params.productId })
      .populate("buyer", "name avatar email")
      .populate("seller", "name shopName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bids,
      currentPrice: product.currentPrice || product.startingPrice,
      totalBids: bids.length
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get all bids RECEIVED by a seller (from Users)
exports.getSellerBids = catchAsyncErrors(async (req, res, next) => {
  try {
    const bids = await Bid.find({
      seller: req.seller._id,
      bidderType: { $ne: 'Shop' } // Show bids from users (or legacy bids without type)
    })
      .populate({
        path: "product",
        select: "name images currentPrice startingPrice"
      })
      .populate({
        path: "buyer",
        select: "name email"
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bids
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get all bids PLACED by a seller (on Buyer Requests)
exports.getShopPlacedBids = catchAsyncErrors(async (req, res, next) => {
  try {
    const bids = await Bid.find({
      seller: req.seller._id,
      bidderType: 'Shop' // Only show bids placed by shop
    })
      .populate({
        path: "product",
        select: "name images currentPrice startingPrice description"
      })
      .populate({
        path: "buyer", // The User who created the request
        select: "name email"
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bids
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get user's bids
exports.getUserBids = catchAsyncErrors(async (req, res, next) => {
  try {
    const bids = await Bid.find({
      buyer: req.user._id,
      bidderType: { $ne: 'Shop' }
    })
      .populate({
        path: "product",
        select: "name images startingPrice currentPrice buyNowPrice auctionEndTime shop"
      })
      .populate("seller", "shopName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bids,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get all bids (admin)
exports.getAllBidsAdmin = catchAsyncErrors(async (req, res, next) => {
  try {
    const bids = await Bid.find()
      .populate({
        path: "product",
        select: "name images currentPrice startingPrice"
      })
      .populate({
        path: "buyer",
        select: "name email"
      })
      .populate({
        path: "seller",
        select: "name shopName"
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bids
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Update bid status
exports.updateBidStatus = catchAsyncErrors(async (req, res, next) => {
  try {
    const { status } = req.body;
    const bid = await Bid.findById(req.params.bidId)
      .populate("product")
      .populate("buyer", "email name")
      .populate("seller", "name shopName email");

    if (!bid) {
      return next(new ErrorHandler("Bid not found", 404));
    }

    // Check authorization based on the route
    if (req.originalUrl.includes('/checkout')) {
      // For checkout route, verify if the user is the buyer
      if (bid.buyer._id.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("Unauthorized: Not the bid owner", 403));
      }
    } else {
      // For general status updates (Accept/Reject), allow:
      // 1. Seller (if it's a seller managing their bids on normal products - though usually they don't "accept" bids on auctions like this)
      // 2. Product Owner (if it's a Buyer Request and they are choosing a winner)

      const product = await Product.findById(bid.product);

      let isAuthorized = false;

      // Case 1: Seller managing their own bid (maybe for withdrawing? but here we are talking about status update)
      // Actually, for Buyer Requests, the User (Buyer) accepts/rejects the Seller's bid.
      if (product.isBuyerRequest && product.user.toString() === req.user._id.toString()) {
        isAuthorized = true;
      }
      // Case 2: Standard Seller/Shop logic (existing)
      else if (req.seller && bid.seller._id.toString() === req.seller._id.toString()) {
        isAuthorized = true;
      }

      if (!isAuthorized) {
        return next(new ErrorHandler("Unauthorized: You are not allowed to update this bid", 403));
      }
    }

    // Update bid status
    bid.status = status;

    // If status is completed during checkout, update additional fields
    if (status === "completed" && req.originalUrl.includes('/checkout')) {
      bid.isCheckedOut = true;
    }

    await bid.save();

    // Send email notification to buyer
    try {
      if (bid.buyer.email) {
        const mailData = {
          email: bid.buyer.email,
          subject: `Bid ${status}: ${bid.product.name}`,
          html: `
Dear ${bid.buyer.name},

Your bid for ${bid.product.name} has been ${status}${req.originalUrl.includes('/checkout') ? ' and is now being processed' : ' by the seller'}.

Bid Details:
- Product: ${bid.product.name}
- Bid Amount: Rs.${bid.bidAmount}
- Status: ${bid.status}
- Seller: ${bid.seller.shopName}

${status === "accepted" ? "Please proceed to checkout to complete your purchase." : ""}
${status === "completed" ? "Your order is being processed. We'll update you once it's shipped." : ""}

Best regards,
BLoved Bidding Team
          `,
        };
        await sendMail(mailData);
      }
    } catch (emailError) {
      console.log("Error sending email:", emailError);
    }

    res.status(200).json({
      success: true,
      message: `Bid ${status} successfully`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// End auction
exports.endAuction = catchAsyncErrors(async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    if (product.auctionEnded) {
      return next(new ErrorHandler("Auction already ended", 400));
    }

    if (new Date() < product.auctionEndTime) {
      return next(new ErrorHandler("Auction time has not ended yet", 400));
    }

    // Get highest bid
    const highestBid = product.bids[product.bids.length - 1];
    if (highestBid) {
      product.winningBid = {
        bidder: highestBid.bidder,
        amount: highestBid.amount,
        time: highestBid.time
      };
    }

    product.auctionEnded = true;
    await product.save();

    // Notify winner
    if (highestBid) {
      const winner = await User.findById(highestBid.bidder);
      if (winner && winner.email) {
        const mailData = {
          email: winner.email,
          subject: "Congratulations! You won the auction",
          html: `You won the auction for ${product.name} with a bid of Rs.${highestBid.amount}`,
        };
        await sendMail(mailData);
      }
    }

    res.status(200).json({
      success: true,
      message: "Auction ended successfully",
      winningBid: product.winningBid
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Create a new seller bid
exports.createSellerBid = catchAsyncErrors(async (req, res, next) => {
  try {
    const { productId, bidAmount } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    if (product.auctionEnded || new Date() > product.auctionEndTime) {
      return next(new ErrorHandler("Auction has ended", 400));
    }

    const currentHighestBid = product.currentPrice || product.startingPrice;

    // For Buyer Requests, logic is inverted (Reverse Auction)
    // Bid must be LOWER than current price by at least the decrement value
    const maxBidAmount = currentHighestBid - product.incrementValue;

    if (bidAmount > maxBidAmount) {
      return next(new ErrorHandler(`Bid amount must be at most ${maxBidAmount} (Current Price - Decrement)`, 400));
    }

    const bid = await Bid.create({
      product: productId,
      buyer: product.user,
      seller: req.seller._id,
      bidder: req.seller._id,
      bidderType: 'Shop',
      bidAmount,
    });

    product.currentPrice = bidAmount;
    product.bids.push({
      bidder: req.seller._id,
      bidderType: 'Shop',
      amount: bidAmount,
      time: new Date()
    });
    await product.save();

    // Send email notification to Buyer (User)
    try {
      const buyer = await User.findById(product.user);
      if (buyer && buyer.email) {
        const mailData = {
          email: buyer.email,
          subject: `New Offer: Rs.${bidAmount} for your request ${product.name}`,
          html: `You have received a new offer of Rs.${bidAmount} from ${req.seller.name} for your request: ${product.name}`,
        };
        await sendMail(mailData);
      }
    } catch (emailError) {
      console.log("Error sending email:", emailError);
    }

    res.status(201).json({
      success: true,
      bid,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
