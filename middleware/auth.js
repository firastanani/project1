const jwt = require("jsonwebtoken");
const User = require("../model/User.js");
const config = require('config');

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("firas ", "");
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const user = await User.findOne({
      _id: decoded._id,
      "tokens": token,
    });

    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};
module.exports = auth;
