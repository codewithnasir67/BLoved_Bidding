const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  try {
    // Validate required options
    if (!options || typeof options !== 'object') {
      throw new Error('Options object is required');
    }
    if (!options.email) {
      throw new Error('Recipient email is required');
    }
    if (!options.subject) {
      throw new Error('Email subject is required');
    }
    if (!options.html) {
      throw new Error('Email content (html) is required');
    }

    // Check for placeholder credentials
    // Check for placeholder credentials
    if (process.env.SMTP_MAIL === "your-email@gmail.com" || process.env.SMTP_PASSWORD === "your-app-password") {
      console.log("----------------------------------------------------------------");
      console.log("Using Placeholder Credentials - Simulating Email Send");
      console.log("To: " + options.email);
      console.log("Subject: " + options.subject);
      console.log("Content (HTML): " + options.html);
      console.log("----------------------------------------------------------------");
      return { messageId: "simulated-id" };
    }

    // Create a transporter
    console.log(`SMTP Debug: Mail=${process.env.SMTP_MAIL ? 'Yes' : 'No'}, Pass=${process.env.SMTP_PASSWORD ? 'Yes' : 'No'}`);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
      },
      debug: true,
      logger: true
    });

    // Verify the connection
    try {
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("SMTP Verification Error:", verifyError);
      throw verifyError;
    }

    // Setup email data
    const mailOptions = {
      from: `"BLoved Bidding" <${process.env.SMTP_MAIL}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    // Log the email being sent (for debugging)
    console.log("Sending email to:", options.email);

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    return info;
  } catch (error) {
    console.error("Email Send Error:", {
      errorCode: error.code,
      errorMessage: error.message,
      command: error.command,
      response: error.response,
      options: options // Log the options that were passed (excluding sensitive data)
    });
    throw error;
  }
};

module.exports = sendMail;