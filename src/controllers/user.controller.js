import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;

  if (
    [username, fullName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(409, "User with this email already exists");
  }

  const newUser = await User.create({ username, fullName, email, password });

  if (!newUser) {
    throw new ApiError(500, "Failed to register user");
  }

  return ApiResponse(res, 201, true, "User registered successfully", {
    newUser,
  });
});

const loginUser = asyncHandler(async (res, res) => {});

export { registerUser };
