exports.display_costume_error = (res, error) => {
    res.status(res.statusCode).json({
      error: true,
      message: error
    })
  }
  