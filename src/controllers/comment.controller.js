import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import Comment from "../models/";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page,
    limit,
  };

  if (!videoId) {
    throw new ApiError(400, "VideoId is invalid");
  }

  const myAggregateComments = Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "commentor",
      },
    },
    {
      $unwind: "$commentor",
    },
    {
      $project: {
        _id: 1,
        content: 1,
        "commentor._id": 1,
        "commentor.username": 1,
        "commentor.avatar": 1,
        "commentor.fullName": 1,
        "commentor.createdAt": 1,
      },
    },
  ]);

  if (!myAggregateComments) {
    throw new ApiError(400, "Invalid comment fetching.");
  }

  Comment.aggregatePaginate(
    myAggregateComments,
    options,
    function (err, results) {
      if (err) {
        console.error(err);
        throw new ApiError(
          400,
          "Invalid comment fetching in aggregation pipeline.",
        );
      } else {
        return ApiResponse(
          res,
          200,
          results,
          "Got Video all comments successfully.",
        );
      }
    },
  );
});
