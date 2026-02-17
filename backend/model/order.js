const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    cart: [{
        item: {
            type: mongoose.Schema.Types.Mixed,  // Can be product or auction item
            required: true,
        },
        shopId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Shop"
        },
        qty: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        }
    }],
    shippingAddress: {
        type: Object,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.Mixed,  // Can be either Object or String
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: "Processing",
    },
    orderType: {
        type: String,
        enum: ['cart', 'auction', 'buy_now'],
        default: 'cart'
    },
    bidId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bid"
    },
    paymentInfo: {
        id: {
            type: String,
        },
        status: {
            type: String,
        },
        type: {
            type: String,
        },
    },
    paidAt: {
        type: Date,
        default: Date.now(),
    },
    deliveredAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Order", orderSchema);