const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'bidderType',
    required: true
  },
  bidderType: {
    type: String,
    required: true,
    enum: ['User', 'Shop']
  },
  bidAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  isCheckedOut: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Bid", bidSchema);

const express = require("express");
const Bid = require("../model/bid");
const Shop = require("../model/shop");
const Product = require("../model/product");
const { isAuthenticated } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail");

// create a new bid
exports.createBid = catchAsyncErrors(async (req, res, next) => {
  try {
    const { productId, bidAmount } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    const bid = await Bid.create({
      product: productId,
      buyer: req.user._id,
      seller: product.shop,
      bidAmount,
    });

    // Send email notification to seller
    const shop = await Shop.findById(product.shop);
    const mailData = {
      to: shop.email,
      subject: "New Bid Received",
      text: `You have received a new bid of $${bidAmount} for your product ${product.name}`,
    };

    await sendMail(mailData);

    res.status(201).json({
      success: true,
      bid,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// get all bids for a product
exports.getProductBids = catchAsyncErrors(async (req, res, next) => {
  try {
    const bids = await Bid.find({ product: req.params.productId })
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bids,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update bid status (accept/reject)
exports.updateBidStatus = catchAsyncErrors(async (req, res, next) => {
  try {
    const { status } = req.body;
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return next(new ErrorHandler("Bid not found", 404));
    }

    bid.status = status;
    await bid.save();

    // Send email notification to buyer
    const buyer = await User.findById(bid.buyer);
    const product = await Product.findById(bid.product);

    const mailData = {
      to: buyer.email,
      subject: `Bid ${status}`,
      text: `Your bid of $${bid.bidAmount} for ${product.name} has been ${status}`,
    };

    await sendMail(mailData);

    res.status(200).json({
      success: true,
      bid,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
