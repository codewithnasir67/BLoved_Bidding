const mongoose = require("mongoose");
const Admin = require("./model/admin");
require("dotenv").config({ path: "./.env" });

const dbUrl = process.env.DB_URL || "mongodb+srv://testingyou9966:Pakistan9786@blovedbidding.6eg17.mongodb.net/?appName=blovedbidding";

const seedAdmin = async () => {
    try {
        if (!dbUrl) {
            throw new Error("DB_URL is not defined in .env file");
        }

        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to database...");

        const email = "testingu7766@gmail.com";
        const password = "Nasir@1234";

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            console.log(`Admin with email ${email} already exists.`);
            process.exit(0);
        }

        const newAdmin = await Admin.create({
            email,
            password,
        });

        console.log(`SUCCESS: Admin created in 'adminClusters' collection.`);
        console.log(`Email: ${newAdmin.email}`);
        console.log(`ID: ${newAdmin._id}`);

    } catch (error) {
        console.error("Error creating admin:");
        console.error(error); // Print the full error object
        if (error.message) console.error("Message:", error.message);
        if (error.stack) console.error("Stack:", error.stack);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from database.");
        process.exit(0);
    }
};

seedAdmin();
