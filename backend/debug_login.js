const mongoose = require("mongoose");
const Admin = require("./model/admin");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const debugLogin = async () => {
    try {
        console.log("--- START DEBUG LOGIN ---");
        console.log("CWD:", process.cwd());
        console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY ? "Defined" : "UNDEFINED");
        console.log("DB_URL:", process.env.DB_URL ? "Defined" : "UNDEFINED");

        if (!process.env.JWT_SECRET_KEY) {
            console.error("CRITICAL: JWT_SECRET_KEY is missing! Token generation will fail.");
            // Don't exit, let's see where it fails
        }

        console.log("Connecting to DB...");
        const dbUrl = process.env.DB_URL || "mongodb+srv://testingyou9966:Pakistan9786@blovedbidding.6eg17.mongodb.net/?appName=blovedbidding";
        await mongoose.connect(dbUrl);
        console.log("Connected.");

        const email = "testingu7766@gmail.com";
        const password = "Nasir@1234";

        console.log(`Finding user: ${email}`);
        const user = await Admin.findOne({ email }).select("+password");

        if (!user) {
            console.log("User not found!");
            return;
        }

        console.log("User found. ID:", user._id);
        console.log("Stored Hashed Password:", user.password);

        console.log("Comparing password...");
        const isMatch = await user.comparePassword(password);
        console.log("Password Match Result:", isMatch);

        if (isMatch) {
            console.log("Generating Token...");
            const token = user.getJwtToken();
            console.log("Token generated:", token.substring(0, 20) + "...");
        } else {
            console.log("Password did not match!");
        }

    } catch (error) {
        console.error("DEBUG EXCEPTION:", error);
    } finally {
        await mongoose.disconnect();
        console.log("--- END DEBUG LOGIN ---");
    }
};

debugLogin();
