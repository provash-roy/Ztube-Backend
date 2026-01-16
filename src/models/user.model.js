const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: [true, "Password is required"] },
    avatar: { type: String, default: "" },
    coverPhoto: { type: String, default: "" },
    watchHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    refreshToken: { type: String, default: "" },
  },
  { timestamps: true }
);



export const User = mongoose.model("User", userSchema);
