import Like from "../models/like.model";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";

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
