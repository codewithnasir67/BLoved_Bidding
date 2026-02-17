const express = require("express");
const router = express.Router();
const { isAuthenticated, isSeller, isAuthenticatedAdmin } = require("../middleware/auth");
const {
  createBid,
  createSellerBid,
  getSellerBids,
  getShopPlacedBids,
  getUserBids,
  updateBidStatus,
  getProductBids,
  getAllBidsAdmin
} = require("../controller/bid");

// Create new bid
router.post("/", isAuthenticated, createBid);

// Create new seller bid (for buyer requests)
router.post("/seller-bid", isSeller, createSellerBid);

// Get all bids for a product
router.get("/product/:productId", getProductBids);

// Get seller's bids (received)
router.get("/seller", isSeller, getSellerBids);

// Get seller's placed bids (on requests)
router.get("/seller-placed", isSeller, getShopPlacedBids);

// Get user's bids
router.get("/user", isAuthenticated, getUserBids);

// Get all bids (admin only)
router.get("/admin-all-bids", isAuthenticatedAdmin, getAllBidsAdmin);

// Update bid status (accept/reject)
router.put("/:bidId/status", isAuthenticated, updateBidStatus);

// Update bid status (accept/reject) - for Sellers
router.put("/:bidId/seller-status", isSeller, updateBidStatus);

// Update bid status by user (for checkout)
router.put("/:bidId/checkout", isAuthenticated, updateBidStatus);

module.exports = router;
