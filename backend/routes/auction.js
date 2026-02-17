const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const {
  getAllActiveAuctions,
  getAuctionById,
  getUserActiveBids,
  getUserWonAuctions,
  checkAndEndExpiredAuctions
} = require("../controller/auction");

const router = express.Router();

// Public routes
router.get("/active", getAllActiveAuctions);
router.get("/details/:id", getAuctionById);

// Protected routes
router.get("/my-bids", isAuthenticated, getUserActiveBids);
router.get("/won-auctions", isAuthenticated, getUserWonAuctions);

// Admin/System route (should be protected in production)
router.post("/check-expired", checkAndEndExpiredAuctions);

module.exports = router;
