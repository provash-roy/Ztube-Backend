const registerUser = require("../controllers/user.controller");

const router = require("express").Router();

router.route("/register").get((req, res) => {
  res.send("User registration endpoint");
});

module.exports = router;
