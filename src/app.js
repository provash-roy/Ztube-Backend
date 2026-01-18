import express from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRouter from "./routers/user.router.js";
import upload from "./middlewares/multer.middleware.js";




app.use("/api/v1/users",upload.none(), userRouter);

export default app;
