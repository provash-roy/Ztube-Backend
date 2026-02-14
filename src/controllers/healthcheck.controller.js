import asyncHandler from "../utils/asyncHandler";

const healthcheck = asyncHandler(async (req, res) => {
  return ApiResponse(res, 200, "OK");
});

export { healthcheck };
   