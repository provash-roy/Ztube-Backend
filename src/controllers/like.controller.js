import { isValidObjectId } from "mongoose";
import Like from "../models/like.model";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid VideoID");
  }

  const isLiked = await Like.findOne({ video: videoId, likedBy: req.user._id });

  if (!isLiked) {
    const like = await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });

    return ApiResponse(res, 200, like, "Liked the Video");
  } else {
    const like = await isLiked.deleteOne();
    return ApiResponse(res, 200, like, "Unliked the Video");
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid CommentId");
  }

  const isLiked = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (!isLiked) {
    const like = await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });

    return ApiResponse(res, 200, like, "Liked the Comment");
  } else {
    const like = await isLiked.deleteOne();
    return ApiResponse(res200, like, "Unliked the Comment");
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user._id),
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    { $unwind: "$videoDetails" },
    {
      $lookup: {
        from: "users",
        localField: "likedBy",
        foreignField: "_id",
        as: "channel",
      },
    },
    { $unwind: "$channel" },
    {
      $project: {
        _id: 0,
        likedAt: "$createdAt",
        videoDetails: 1,
        channel: {
          username: "$channel.username",
          avatar: "$channel.avatar",
        },
      },
    },
  ]);

  return ApiResponse(res, 200, likedVideos, "All Liked Videos");
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
