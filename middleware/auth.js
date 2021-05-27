const jwt = require("jsonwebtoken");
const {User} = require("../models/user");
const config = require('config');

const auth = async ({ req }) => {
  let isAuth = false;
  try {
    const token = req.header("Authorization");
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const user = await User.findOne({
      _id: decoded._id,
      "tokens": token,
    });

    if (!user) {
      return {isAuth};
    }

    isAuth = true;
    return {user , isAuth};

  } catch (e) {
    console.log(e.message);
    return { isAuth }
  }

};
module.exports = auth;
