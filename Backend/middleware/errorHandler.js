const errorHandler = async (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Inter Server Error";

  // Mongose bad objectId
  /* এইটা হয় ধরি আমরা একটা user/ product mongodb টি save করেছি এখন আমি যে এইটা save করেছি 
        আমাকে এই user/ product টাকে একটা unique id দেয় mongodb। 
        আমি profile এ ঢুকতে গেলাম user বা product টা দেখতে গেলাম তখন কিন্তু 
        আমার params আকারে userId/ productId টা থাকবে এখন এই id তা যদি 
         ভুল হয় তাহলে আমাকে এই CastError দিবে mongodb 
    */
  if (err.name === "CastError") {
    message = "resource not found";
    statusCode = 404;
  }

  // Mongoose duplicate key
  /*
        duplicate key error হয় তখনই যখন আমি একটা email দিয়ে register করেছি এখন 
        একই email দিয়ে যখন আবার রেজিস্ট্রেশন করতে যায় তখন এই error আসে. 
    */
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exist`;
    statusCode = 400;
  }

  //Mongoose Validation Error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  }

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    message = "File size excede must be the maximum limit of 10MB";
    statusCode = 400;
  }

  // JWT ERROR
  if (err.name === "JsonWebTokenError") {
    message = "Invalid Token";
    statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    message = "Token Expired";
    statusCode = 401;
  }

  console.error("Error: ", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    //err.stack = error কোথায় কোথায় হয়েছে তার full trace
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
module.exports = { errorHandler };
