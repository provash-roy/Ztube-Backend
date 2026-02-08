import User from "../models/user.model";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import uploadToCloudinary from "../utils/cloudinary";

const getAllVideos = asyncHandler(async (req, res) => {
  const search = req.query.search || "";
  const sortQuery = req.query.sort || "createdAt_desc";

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const query = search ? { title: { $regex: search, $options: "i" } } : {};

  const [field, order] = sortQuery.split("_");
  const sort = { [field]: order === "asc" ? 1 : -1 };

  const aggregatePipeline = [
    { $match: query },
    { $sort: sort },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "channel",
      },
    },
    { $unwind: "$channel" },
    {
      $project: {
        _id: 1,
        thumbnail: 1,
        title: 1,
        duration: 1,
        views: {
          $cond: {
            if: { $isArray: "$views" },
            then: { $size: "$views" },
            else: { $ifNull: ["$views", 0] },
          },
        },
        isPublished: 1,
        "channel._id": 1,
        "channel.username": 1,
        "channel.avatar": 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ];

  const aggregate = Video.aggregate(aggregatePipeline);
  const result = await Video.aggregatePaginate(aggregate, { page, limit });

  if (!result) {
    return new ApiError(400, "Failed to fetch videos");
  }

  return ApiResponse(res, 200, "Videos fetched successfully", result);
});

const uploadAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return ApiResponse(res, 400, "Title or Description is invalid");
  }

  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  if (!videoLocalPath) {
    throw new ApiError(400, "Video path is required");
  }

  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail path is required");
  }

  const videoFile = await uploadToCloudinary(videoLocalPath);
  const thumbnail = await uploadToCloudinary(thumbnailLocalPath);

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    owner: req.user._id,
    title,
    description,
    duration: videoFile.duration,
  });

  return ApiResponse(res, 200, "Video uploaded successfully", video);
});

export { getAllVideos, uploadAVideo };
