const jwt = require("jsonwebtoken");
const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) return res.status(401).json("Authentication Failed!");
    token = token.split(" ")[1];
    if (!token) return res.status(401).json("Authentication Failed!");
    jwt.verify(token, process.env.JWT_SECRET, async (err, tokenData) => {
      if (err) return res.status(401).json("Authentication Failed!");
      req.user = { ...tokenData };
      next();
    });
  } catch (error) {
    return res
      .status(error.code || 500)
      .json(error.message || "Something went wrong, please try again!");
  }
};

module.exports = verifyToken;
