const express = require("express");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const Shop = require("../model/shop");
const { isAuthenticated, isSeller, isAdmin, isAuthenticatedAdmin } = require("../middleware/auth");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/shopToken");
const shop = require("../model/shop");
const fs = require("fs");

// create shop
router.post("/create-shop", catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, name, password, avatar, phoneNumber, address, zipCode } = req.body;

    // Validate required fields
    if (!phoneNumber || !zipCode) {
      return next(new ErrorHandler("Phone number and ZIP code are required", 400));
    }

    const sellerEmail = await Shop.findOne({ email });
    if (sellerEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }

    if (!avatar) {
      return next(new ErrorHandler("Avatar image is required", 400));
    }

    let myCloud;
    try {
      const fs = require('fs');
      const base64Data = avatar.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const fileName = `shop-${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
      const filePath = path.join(__dirname, "../uploads", fileName);

      fs.writeFileSync(filePath, buffer);

      myCloud = {
        public_id: fileName,
        secure_url: `http://localhost:8000/uploads/${fileName}`
      };

    } catch (error) {
      console.error("Local Image Upload Error:", error);
      return next(new ErrorHandler("Image upload failed", 400));
    }

    const seller = {
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      address,
      phoneNumber,
      zipCode,
    };

    const activationToken = createActivationToken(seller);

    const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;

    try {
      await sendMail({
        email: seller.email,
        subject: "Activate your Shop",
        message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to BLoved Bidding!</h2>
            <p>Hello ${seller.name},</p>
            <p>Thank you for registering your shop. To start selling, please activate your account by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${activationUrl}" style="background-color: #2dd4bf; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify My Shop</a>
            </div>
            <p>The link is valid for 24 hours.</p>
          </div>
        `,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email:- ${seller.email} to activate your shop!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
}));

// create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "24h", // Increased to 24 hours to give users more time
  });
};

// activate seller
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      let newSeller;
      try {
        newSeller = jwt.verify(
          activation_token,
          process.env.ACTIVATION_SECRET
        );
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          return next(new ErrorHandler("Activation link has expired. Please sign up again.", 400));
        }
        return next(new ErrorHandler("Invalid activation token. Please try again.", 400));
      }

      if (!newSeller) {
        return next(new ErrorHandler("Invalid token", 400));
      }

      const { name, email, password, avatar, zipCode, address, phoneNumber } = newSeller;

      let seller = await Shop.findOne({ email });

      if (seller) {
        return next(new ErrorHandler("Shop already exists", 400));
      }

      seller = await Shop.create({
        name,
        email,
        avatar,
        password,
        zipCode,
        address,
        phoneNumber,
      });

      sendShopToken(seller, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login shop
router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const seller = await Shop.findOne({ email }).select("+password");

      if (!seller) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await seller.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      // Send seller data along with token
      const token = seller.getJwtToken();

      // Remove password from seller object
      seller.password = undefined;

      // Options for cookies
      const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      };

      res.status(201)
        .cookie("seller_token", token, options)
        .json({
          success: true,
          seller,
          token,
        });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// forgot password
router.post(
  "/forgot-password",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email } = req.body;

      const seller = await Shop.findOne({ email });

      if (!seller) {
        return next(new ErrorHandler("User not found with this email", 404));
      }

      const resetToken = jwt.sign({ id: seller._id }, process.env.ACTIVATION_SECRET, {
        expiresIn: "30m",
      });

      const resetUrl = `http://localhost:3000/shop-reset-password/${resetToken}`;

      try {
        await sendMail({
          email: seller.email,
          subject: "Reset your Shop password",
          message: `Hello ${seller.name}, please click on the link to reset your password: ${resetUrl}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Reset Shop Password</h2>
              <p>Hello ${seller.name},</p>
              <p>You requested a password reset for your shop account. Please click the button below to create a new password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #2dd4bf; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
              </div>
              <p>If you didn't reqest this, please ignore this email.</p>
              <p><a href="${resetUrl}">${resetUrl}</a></p>
              <p>This link is valid for 30 minutes.</p>
            </div>
          `,
        });

        res.status(200).json({
          success: true,
          message: `Please check your email: ${seller.email} to reset your password!`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// reset password
router.post(
  "/reset-password",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { token, newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
      }

      const decoded = jwt.verify(token, process.env.ACTIVATION_SECRET);

      if (!decoded) {
        return next(new ErrorHandler("Invalid or expired token", 400));
      }

      const seller = await Shop.findById(decoded.id);

      if (!seller) {
        return next(new ErrorHandler("User not found", 404));
      }

      seller.password = newPassword;
      await seller.save();

      res.status(200).json({
        success: true,
        message: "Shop password reset successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load shop
router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out from shop
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Options for cookies
      const options = {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      };

      res.cookie("seller_token", null, options);

      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update shop profile picture
router.put(
  "/update-shop-avatar",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      let existsSeller = await Shop.findById(req.seller._id);

      const imageId = existsSeller.avatar.public_id;

      // Try to delete old image if it's local
      const oldFilePath = path.join(__dirname, "../uploads", imageId);
      if (fs.existsSync(oldFilePath)) {
        fs.unlink(oldFilePath, (err) => {
          if (err) console.log("Error deleting old avatar:", err);
        });
      }

      const base64Data = req.body.avatar.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const fileName = `shop-${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
      const filePath = path.join(__dirname, "../uploads", fileName);

      fs.writeFileSync(filePath, buffer);

      existsSeller.avatar = {
        public_id: fileName,
        url: `http://localhost:8000/uploads/${fileName}`,
      };


      await existsSeller.save();

      res.status(200).json({
        success: true,
        seller: existsSeller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller info
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, description, address, phoneNumber, zipCode } = req.body;

      const shop = await Shop.findOne(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }

      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;

      await shop.save();

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all sellers --- for admin
router.get(
  "/admin-all-sellers",
  isAuthenticatedAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellers = await Shop.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller ---admin
router.delete(
  "/delete-seller/:id",
  isAuthenticatedAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.params.id);

      if (!seller) {
        return next(
          new ErrorHandler("Seller is not available with this id", 400)
        );
      }

      await Shop.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Seller deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller withdraw methods --- sellers
router.put(
  "/update-payment-methods",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { withdrawMethod } = req.body;

      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        withdrawMethod,
      });

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller withdraw merthods --- only seller
router.delete(
  "/delete-withdraw-method/",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("Seller not found with this id", 400));
      }

      seller.withdrawMethod = null;

      await seller.save();

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update shop rating
router.put(
  "/update-shop-rating",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { shopId, rating } = req.body;

      if (!shopId || !rating) {
        return next(new ErrorHandler("Shop ID and rating are required", 400));
      }

      if (rating < 1 || rating > 5) {
        return next(new ErrorHandler("Rating must be between 1 and 5", 400));
      }

      const shop = await Shop.findById(shopId);

      if (!shop) {
        return next(new ErrorHandler("Shop not found", 404));
      }

      // Initialize ratings array if it doesn't exist
      if (!shop.ratings) {
        shop.ratings = [];
      }

      // Check if user has already rated this shop
      const existingRatingIndex = shop.ratings.findIndex(
        (r) => r.user && r.user.toString() === req.user._id.toString()
      );

      if (existingRatingIndex !== -1) {
        // Update existing rating
        shop.ratings[existingRatingIndex].rating = rating;
      } else {
        // Add new rating
        shop.ratings.push({
          user: req.user._id,
          rating: rating,
        });
      }

      // Calculate average rating
      const totalRating = shop.ratings.reduce((acc, item) => acc + item.rating, 0);
      shop.averageRating = totalRating / shop.ratings.length;

      await shop.save();

      res.status(200).json({
        success: true,
        message: "Rating submitted successfully",
        averageRating: shop.averageRating,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
