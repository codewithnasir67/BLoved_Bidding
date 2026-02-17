const mongoose = require("mongoose");
const User = require("./model/user"); // Path to your User model
require("dotenv").config({ path: "./.env" }); // Load env variables if needed, though we might rely on the hardcoded string from Database.js for safety or just use the env variable.

// Use the DB_URL from your .env file or the one found in Database.js
const dbUrl = process.env.DB_URL || "mongodb+srv://testingyou9966:Pakistan9786@blovedbidding.6eg17.mongodb.net/?appName=blovedbidding";

const makeAdmin = async () => {
    const email = process.argv[2];

    if (!email) {
        console.log("Please provide an email address as an argument.");
        console.log("Usage: node create_admin.js <user_email>");
        process.exit(1);
    }

    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to database...");

        const user = await User.findOne({ email: email });

        if (!user) {
            console.log(`User with email '${email}' not found.`);
            process.exit(1);
        }

        user.role = "Admin";
        await user.save();

        console.log(`SUCCESS: User '${user.name}' (${user.email}) is now an Admin!`);
        console.log("You can now log in and access /admin/dashboard");

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from database.");
        process.exit(0);
    }
};

makeAdmin();
