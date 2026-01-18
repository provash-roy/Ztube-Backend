import express from "express";
import userRouter from "./routers/user.router.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.use("/api/v1/users", userRouter);

export default app;
