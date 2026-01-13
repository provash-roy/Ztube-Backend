const apiResponse = (res, statusCode, success = true, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};
module.exports = apiResponse;
