import registerUser from "../controllers/user.controller.js";
import express from "express";

const router = express.Router();

router.route("/register").get((req, res) => {
  res.send("User registration endpoint");
});

export default router;
