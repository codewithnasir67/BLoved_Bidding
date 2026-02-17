// // // // const express = require("express");
// // // // const { placeBid, getBids } = require("../../../backend/controller/bidController");

// // // // const router = express.Router();

// // // // router.post("/", placeBid);  // Bid place karne ka route
// // // // router.get("/:productId", getBids);  // Bids fetch karne ka route

// // // // module.exports = router;

// // // // const express = require("express");
// // // // const router = express.Router();
// // // // const { isAuthenticated } = require("../middleware/auth");

// // // // // Bid controller functions
// // // // const { 
// // // //   createBid,
// // // //   getBidsForProduct 
// // // // } = require("../controller/bidController");

// // // // // Create new bid
// // // // router.post("/bids", isAuthenticated, createBid);

// // // // // Get bids for a product
// // // // router.get("/bids/:productId", getBidsForProduct);

// // // // module.exports = router;
// // // const express = require('express');
// // // const router = express.Router();
// // // const { 
// // //   getSellerProductBids, 
// // //   acceptBid 
// // // } = require('../controllers/bidController');
// // // const { isAuthenticated, isSeller } = require('../middleware/auth');

// // // // Seller specific routes
// // // router.get('/seller/bids/:productId', 
// // //   isAuthenticated, 
// // //   isSeller, 
// // //   getSellerProductBids
// // // );

// // // router.put('/seller/accept-bid/:bidId', 
// // //   isAuthenticated, 
// // //   isSeller, 
// // //   acceptBid
// // // );

// // // module.exports = router;
// // // backend/routes/bid.js
// // const express = require('express');
// // const router = express.Router();
// // const { isAuthenticated } = require('../middleware/auth');
// // const Bid = require('../models/bid');
// // const Product = require('../models/product');

// // // Place a bid
// // router.post('/place-bid', isAuthenticated, async (req, res) => {
// //   try {
// //     const { productId, amount } = req.body;
// //     const userId = req.user.id;

// //     // Get product details
// //     const product = await Product.findById(productId);
// //     if (!product) {
// //       return res.status(404).json({ message: "Product not found" });
// //     }

// //     // Get highest bid
// //     const highestBid = await Bid.findOne({ productId })
// //       .sort({ amount: -1 });

// //     // Validate bid amount
// //     if (highestBid && amount <= highestBid.amount) {
// //       return res.status(400).json({
// //         message: `Bid must be higher than current highest bid of ${highestBid.amount}`
// //       });
// //     }

// //     // Create new bid
// //     const bid = new Bid({
// //       productId,
// //       userId,
// //       sellerId: product.shop._id,
// //       amount
// //     });

// //     await bid.save();

// //     res.status(201).json({ 
// //       success: true,
// //       bid 
// //     });

// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // });

// // // Get bids for a product
// // router.get('/product-bids/:productId', async (req, res) => {
// //   try {
// //     const bids = await Bid.find({ productId: req.params.productId })
// //       .populate('userId', 'name')
// //       .sort({ amount: -1 });

// //     res.json({ bids });
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // });

// // // Get seller's received bids
// // router.get('/seller-bids', isAuthenticated, async (req, res) => {
// //   try {
// //     const bids = await Bid.find({ sellerId: req.user.id })
// //       .populate('productId')
// //       .populate('userId', 'name')
// //       .sort({ createdAt: -1 });

// //     res.json({ bids });
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // });

// // module.exports = router;
// // frontend/redux/actions/bidActions.js
// import axios from 'axios';
// import { server } from '../../server';

// export const placeBid = (productId, amount) => async (dispatch) => {
//   try {
//     dispatch({ type: 'PLACE_BID_REQUEST' });

//     const config = { 
//       headers: { "Content-Type": "application/json" },
//       withCredentials: true 
//     };

//     const { data } = await axios.post(
//       `${server}/api/v2/bid/place-bid`,
//       { productId, amount },
//       config
//     );

//     dispatch({ 
//       type: 'PLACE_BID_SUCCESS',
//       payload: data.bid 
//     });

//   } catch (error) {
//     dispatch({
//       type: 'PLACE_BID_FAIL',
//       payload: error.response?.data?.message
//     });
//   }
// };

// export const getProductBids = (productId) => async (dispatch) => {
//   try {
//     dispatch({ type: 'GET_PRODUCT_BIDS_REQUEST' });

//     const { data } = await axios.get(
//       `${server}/api/v2/bid/product-bids/${productId}`
//     );

//     dispatch({ 
//       type: 'GET_PRODUCT_BIDS_SUCCESS',
//       payload: data.bids 
//     });

//   } catch (error) {
//     dispatch({
//       type: 'GET_PRODUCT_BIDS_FAIL',
//       payload: error.response?.data?.message
//     });
//   }
// };