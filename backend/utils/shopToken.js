// create token and saving that in cookies
const sendShopToken = (seller, statusCode, res) => {
  const token = seller.getJwtToken();

  // Remove password from seller object
  seller.password = undefined;

  // Options for cookies
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.sameSite = "none";
    options.secure = true;
  }

  res.status(statusCode).cookie("seller_token", token, options).json({
    success: true,
    seller,
    token,
  });
};

module.exports = sendShopToken;
