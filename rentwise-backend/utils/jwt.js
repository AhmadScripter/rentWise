const jwt = require("jsonwebtoken");

const getEmailFromToken = (token) => {
  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    return decoded.email;
  } catch (error) {
    return null;
  }
};

module.exports = getEmailFromToken;