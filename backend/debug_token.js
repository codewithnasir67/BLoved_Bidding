const mongoose = require("mongoose");
const Admin = require("./model/admin");
require("dotenv").config({ path: "./.env" });

const debugToken = async () => {
    try {
        console.log("Checking environment variables...");
        console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY ? "Defined" : "UNDEFINED");
        console.log("JWT_EXPIRES:", process.env.JWT_EXPIRES ? "Defined" : "UNDEFINED");

        if (!process.env.JWT_SECRET_KEY) {
            console.error("CRITICAL: JWT_SECRET_KEY is missing!");
        }

        console.log("Connecting to DB...");
        const dbUrl = process.env.DB_URL || "mongodb+srv://testingyou9966:Pakistan9786@blovedbidding.6eg17.mongodb.net/?appName=blovedbidding";
        await mongoose.connect(dbUrl);
        console.log("Connected.");

        const email = "testingu7766@gmail.com";
        const user = await Admin.findOne({ email });

        if (!user) {
            console.log("User not found!");
        } else {
            console.log("User found:", user.email);
            try {
                const token = user.getJwtToken();
                console.log("Token generated successfully:", token.substring(0, 20) + "...");
            } catch (err) {
                console.error("Error generating token:", err);
            }
        }

    } catch (error) {
        console.error("Debug Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

debugToken();
