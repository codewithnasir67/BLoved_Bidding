const express = require("express");
const User = require("../model/user");
const Admin = require("../model/admin");
const router = express.Router();
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const sendAdminToken = require("../utils/adminToken");

const { isAuthenticated, isAdmin, isAuthenticatedAdmin } = require("../middleware/auth");
const fs = require("fs");
const path = require("path");

// create user
router.post("/create-user", async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;
    console.log(`user ${email}`);
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const user = {
      name: name,
      email: email,
      password: password,
    };

    const activationToken = createActivationToken(user);

    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to BLoved Bidding!</h2>
            <p>Hello ${user.name},</p>
            <p>Thank you for registering with us. To complete your sign-up, please activate your account by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${activationUrl}" style="background-color: #2dd4bf; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify My Account</a>
            </div>
            <p>If the button doesn't work, you can ignore this email or copy and paste the link below:</p>
            <p><a href="${activationUrl}">${activationUrl}</a></p>
            <p>This link is valid for 30 minutes.</p>
          </div>
        `,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email:- ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return next(new ErrorHandler(error.message, 400));
  }
});

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "30m", // Changed from 5m to 30m for easier testing
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password } = newUser;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }
      user = await User.create({
        name,
        email,
        password,
      });

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      sendToken(user, 201, res);
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

      const user = await User.findOne({ email });

      if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
      }

      const resetToken = jwt.sign({ id: user._id }, process.env.ACTIVATION_SECRET, {
        expiresIn: "30m",
      });

      const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

      try {
        await sendMail({
          email: user.email,
          subject: "Reset your password",
          message: `Hello ${user.name}, please click on the link to reset your password: ${resetUrl}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Reset Password</h2>
              <p>Hello ${user.name},</p>
              <p>You requested a password reset. Please click the button below to create a new password:</p>
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
          message: `Please check your email: ${user.email} to reset your password!`,
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

      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password reset successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// admin login
// admin login
// admin login
router.post(
  "/admin-login",
  async (req, res, next) => { // Removed catchAsyncErrors for manual handling
    try {
      console.log("Admin login attempt started");
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      console.log(`Looking for admin: ${email}`);
      const user = await Admin.findOne({ email }).select("+password");

      if (!user) {
        console.log("Admin not found");
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      console.log("Admin found, verifying password...");
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        console.log("Invalid password");
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      console.log("Password verified, sending token...");
      try {
        sendAdminToken(user, 201, res);
        console.log("Token sent successfully");
      } catch (tokenError) {
        console.error("Token Generation Error:", tokenError);
        return next(new ErrorHandler(`Token Error: ${tokenError.message}`, 500));
      }

    } catch (error) {
      console.error("ADMIN LOGIN CRITICAL ERROR:", error);
      res.status(500).json({
        success: false,
        message: error.message,
        stack: error.stack
      });
    }
  }
);

// load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out user
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { phoneNumber, name } = req.body;

      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      user.name = name;
      user.phoneNumber = phoneNumber;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      let existsUser = await User.findById(req.user.id);
      if (req.body.avatar !== "") {
        // Try to delete old image if it's local
        if (existsUser.avatar && existsUser.avatar.public_id) {
          const imageId = existsUser.avatar.public_id;
          const oldFilePath = path.join(__dirname, "../uploads", imageId);
          if (fs.existsSync(oldFilePath)) {
            fs.unlink(oldFilePath, (err) => {
              if (err) console.log("Error deleting old avatar:", err);
            });
          }
        }

        const base64Data = req.body.avatar.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const fileName = `user-${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
        const filePath = path.join(__dirname, "../uploads", fileName);

        fs.writeFileSync(filePath, buffer);

        existsUser.avatar = {
          public_id: fileName,
          url: `http://localhost:8000/uploads/${fileName}`,
        };
      }

      await existsUser.save();

      res.status(200).json({
        success: true,
        user: existsUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(`${req.body.addressType} address already exists`)
        );
      }

      const existsAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        // add the new address to the array
        user.addresses.push(req.body);
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await User.findById(userId);

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Password doesn't matched with each other!", 400)
        );
      }
      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user cart
router.put(
  "/update-cart",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      user.cart = req.body.cart;

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user wishlist
router.put(
  "/update-wishlist",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      user.wishlist = req.body.wishlist;

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// find user infoormation with the userId
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all users --- for admin
router.get(
  "/admin-all-users",
  isAuthenticatedAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete users --- admin
router.delete(
  "/delete-user/:id",
  isAuthenticatedAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler("User is not available with this id", 400)
        );
      }

      const imageId = user.avatar.public_id;

      await cloudinary.v2.uploader.destroy(imageId);

      await User.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "User deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Log out from admin
router.get(
  "/admin-logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("admin_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get admin info
router.get(
  "/get-admin",
  isAuthenticatedAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await Admin.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update admin info
router.put(
  "/update-admin-info",
  isAuthenticatedAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name } = req.body;

      const user = await Admin.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      if (!user.adminInfo) {
        user.adminInfo = {};
      }
      user.adminInfo.name = name;
      // Phone number removed per request

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update admin avatar
router.put(
  "/update-admin-avatar",
  isAuthenticatedAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      let existsUser = await Admin.findById(req.user.id);

      if (req.body.avatar !== "") {
        // Handle existing admin avatar deletion if it exists
        if (existsUser.adminInfo && existsUser.adminInfo.avatar && existsUser.adminInfo.avatar.public_id) {
          const imageId = existsUser.adminInfo.avatar.public_id;
          await cloudinary.v2.uploader.destroy(imageId);
        }

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
        });

        if (!existsUser.adminInfo) {
          existsUser.adminInfo = {
            avatar: {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            }
          };
        } else {
          existsUser.adminInfo.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }

      await existsUser.save();

      res.status(200).json({
        success: true,
        user: existsUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update admin password
router.put(
  "/update-admin-password",
  isAuthenticatedAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await Admin.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Password doesn't matched with each other!", 400)
        );
      }
      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;