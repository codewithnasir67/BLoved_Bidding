const mongoose = require("mongoose");
const User = require("./model/user"); // Path to your User model
require("dotenv").config({ path: "./.env" });

const dbUrl = process.env.DB_URL || "mongodb+srv://testingyou9966:Pakistan9786@blovedbidding.6eg17.mongodb.net/?appName=blovedbidding";

const seedAdmin = async () => {
    const newEmail = "testingu7766@gmail.com";
    const oldEmail = "testingyou9966@gmail.com";
    const password = "Nasir@9786";

    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to database...");

        // 1. Demote old admin if exists
        const oldAdmin = await User.findOne({ email: oldEmail });
        if (oldAdmin) {
            console.log(`Found old admin (${oldEmail}). Demoting/Updating...`);
            // Check if we can just swap the email (if the new email doesn't already exist)
            const newEmailUser = await User.findOne({ email: newEmail });
            if (!newEmailUser) {
                console.log("New email is free. Renaming old admin account...");
                oldAdmin.email = newEmail;
                oldAdmin.role = "Admin"; // Ensure it's admin
                oldAdmin.password = password; // Ensure password matches
                await oldAdmin.save();
                console.log(`SUCCESS: Renamed '${oldEmail}' to '${newEmail}' and ensured Admin role.`);
                return;
            } else {
                console.log(`User with ${newEmail} already exists. Demoting old admin...`);
                oldAdmin.role = "user"; // Demote
                await oldAdmin.save();
            }
        }

        // 2. Create or Promote new admin (if step 1 didn't handle it via rename)
        let user = await User.findOne({ email: newEmail });

        if (!user) {
            console.log(`User '${newEmail}' not found. Creating new Admin user...`);
            user = new User({
                name: "Super Admin",
                email: newEmail,
                password: password,
                role: "Admin",
                phoneNumber: 1234567890,
            });
        } else {
            console.log(`User '${newEmail}' found. Updating to Admin...`);
            user.role = "Admin";
            user.password = password;
        }

        await user.save();
        console.log(`SUCCESS: Admin user '${user.email}' setup complete.`);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from database.");
        process.exit(0);
    }
};

seedAdmin();
