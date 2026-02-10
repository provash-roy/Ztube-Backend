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

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { newContent } = req.body;

  if (!newContent) {
    throw new ApiError(400, "Invalid Content");
  }

  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content: newContent,
      },
    },
    {
      new: true,
    },
  );

  return ApiResponse(res, 200, "Updated Tweet Successfully", tweet);
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findByIdAndDelete(tweetId);

  return ApiResponse(res, 200, "Deleted Tweet Successfully", tweet);
});
