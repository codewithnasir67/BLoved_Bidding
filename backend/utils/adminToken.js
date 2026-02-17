// create admin token and saving that in cookies
const sendAdminToken = (user, statusCode, res) => {
    const token = user.getJwtToken();

    // Options for cookies
    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.sameSite = "none";
        options.secure = true;
    }

    res.status(statusCode).cookie("admin_token", token, options).json({
        success: true,
        user,
        token,
    });
};

module.exports = sendAdminToken;
