exports.display_error_message = (res, error, statusCode) => {
    res.status(statusCode !== undefined ? statusCode : res.statusCode).json({
      error: true,
      message: error.message,
    });
  };
  