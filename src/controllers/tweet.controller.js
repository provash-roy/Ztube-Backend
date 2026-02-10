import Tweet from "../models/tweet.model";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Content is required.");
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  if (!tweet) {
    throw new ApiError(400, "Tweet Creation Failed");
  }

  return ApiResponse(res, 201, "Tweet created succesfully", tweet);
});

const getUserTweet = asyncHandler(async (req, res) => {
  const userTweet = await Tweet.aggregate([
    { $match: "req.user._id" },
    {
      $sort: "sort",
    },
    {
      $lookUp: {
        from: users,
        localField: owner,
        forignField: _id,
        as: user,
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        "user.fullName": 1,
        avatar: 1,
        content: 1,
        createdAt: 1,
      },
    },
  ]);
});
