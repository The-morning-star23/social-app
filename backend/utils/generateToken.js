// backend/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (res, userId, username) => {
  const token = jwt.sign(
    { userId, username }, // This is the data we're storing in the token
    process.env.JWT_SECRET, // The secret key from our .env file
    { expiresIn: '30d' } // Token expires in 30 days
  );

  return token;
};

module.exports = generateToken;