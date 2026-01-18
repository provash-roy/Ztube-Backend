import registerUser from "../controllers/user.controller.js";
import express from "express";

const router = express.Router();

router
  .route("/register")
  .get((req, res) => {
    res.send("User Registration Endpoint");
  })
  .post(registerUser);

export default router;
