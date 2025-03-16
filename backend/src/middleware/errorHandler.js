const errorHandler = (err, req, res, next) => {
    console.log("🔥🔥 ERROR IN BACKEND", err); // Check this
    const statusCode = err.statusCode || 500;
  
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
      errors: err.errors || [],
    });
  };
  
  export default errorHandler;
  