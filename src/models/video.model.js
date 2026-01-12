const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const videoSchema = new mongoose.Schema(
  {
    videoFile: { type: String, required: true },
    thumbnail: { type: String, required: true },
    description: { type: String, required: true },
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    ispublic: { type: Boolean, default: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

videoSchema.plugin(paginate);

export const Video = mongoose.model("Video", videoSchema);
