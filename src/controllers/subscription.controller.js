import { isValidObjectId } from "mongoose";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import Subscription from "../models/subscription.model";
import ApiResponse from "../utils/apiResponse";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel ID");
  }

  const isSubscribed = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });

  if (req.user._id == channelId) {
    throw new ApiError(400, "You can't subscribe your own channel.");
  }

  if (!isSubscribed) {
    const channel = await Subscription.create({
      subscriber: req.user._id,
      channel: channelId,
    });

    return ApiResponse(res, 200, channel, "Subscribed channel");
  } else {
    const channel = await isSubscribed.deleteOne();

    return ApiResponse(res, 200, channel, "Unsubscribed channel");
  }
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel Id");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberDetails",
      },
    },
    {
      $unwind: "$subscriberDetails",
    },
    {
      $project: {
        _id: 0,
        username: "$subscriberDetails.username",
        avatar: "$subscriberDetails.avatar",
      },
    },
  ]);

  if (!subscribers) {
    throw new ApiError(400, "Fetching Subscriber Failed");
  }

  return ApiResponse(
    res,
    200,
    subscribers,
    "Channel Subscribers fetched successfully",
  );
});

export { toggleSubscription };
