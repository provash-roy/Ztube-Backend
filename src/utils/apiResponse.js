const ApiResponse = (res, statusCode, success = true, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export default ApiResponse;
