import mongoose, { isValidObjectId } from "mongoose";
import Playlist from "../models/playlist.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Name is required.");
  }

  const playlist = await Playlist.create({
    name,
    description: description || "",
    owner: req.user._id,
  });

  if (!playlist) {
    throw new ApiError(400, "Playlist Creation Failed");
  }

  return ApiResponse(res, 200, playlist, "Playlist Created Successfully");
});
