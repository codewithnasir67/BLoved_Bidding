const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your product name!"],
  },
  description: {
    type: String,
    required: [true, "Please enter your product description!"],
  },
  category: {
    type: String,
    required: [true, "Please enter your product category!"],
  },
  tags: {
    type: String,
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
  },
  stock: {
    type: Number,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  reviews: [
    {
      user: {
        type: Object,
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
      productId: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      }
    },
  ],
  ratings: {
    type: Number,
    default: 0,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isBuyerRequest: {
    type: Boolean,
    default: false,
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isAuction: {
    type: Boolean,
    default: false
  },
  startingPrice: {
    type: Number,
  },
  currentPrice: {
    type: Number,
  },
  incrementValue: {
    type: Number,
  },
  buyNowPrice: {
    type: Number,
  },
  auctionStartTime: {
    type: Date,
  },
  auctionEndTime: {
    type: Date,
  },
  bids: [{
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'bids.bidderType',
      required: true
    },
    bidderType: {
      type: String,
      required: true,
      enum: ['User', 'Shop'],
      default: 'User'
    },
    amount: {
      type: Number,
      required: true
    },
    time: {
      type: Date,
      default: Date.now
    }
  }],
  winningBid: {
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: {
      type: Number
    },
    time: {
      type: Date
    }
  },
  auctionEnded: {
    type: Boolean,
    default: false
  },
  auctionStatus: {
    type: String,
    enum: ["pending", "active", "ended"],
    default: "pending"
  }
});

module.exports = mongoose.model("Product", productSchema);
