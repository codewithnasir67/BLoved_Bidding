const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");
const Admin = require("../model/admin");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please login to continue", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);

    next();
});

exports.isAuthenticatedAdmin = catchAsyncErrors(async (req, res, next) => {
    const { admin_token } = req.cookies;

    if (!admin_token) {
        return next(new ErrorHandler("Please login to access admin resources", 401));
    }

    const decoded = jwt.verify(admin_token, process.env.JWT_SECRET_KEY);

    req.user = await Admin.findById(decoded.id);

    next();
});


exports.isSeller = catchAsyncErrors(async (req, res, next) => {
    try {
        const { seller_token } = req.cookies;

        if (!seller_token) {
            return next(new ErrorHandler("Please login to your shop account", 401));
        }

        const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);

        if (!decoded || !decoded.id) {
            return next(new ErrorHandler("Invalid seller token", 401));
        }

        const seller = await Shop.findById(decoded.id);

        if (!seller) {
            return next(new ErrorHandler("Seller account not found", 401));
        }

        req.seller = seller;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new ErrorHandler("Invalid token, please login again", 401));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new ErrorHandler("Session expired, please login again", 401));
        }
        return next(new ErrorHandler("Authentication error, please login again", 401));
    }
});


exports.isAdmin = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`${req.user.role} can not access this resources!`))
        };
        next();
    }
}