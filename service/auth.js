const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET ?? "dev_secret_change_me";
const JWT_EXPIRY = "1d";

function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};