const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;

  // check if token exist in Authorization Header
  /*
Login: প্রথমে, ব্যবহারকারী লগ ইন করলে সার্ভার তাকে একটি JWT token দেয়, যেটা Bearer token হিসেবে পরিচিত।

Client Side: ব্যবহারকারী এই token টা ক্লায়েন্ট সাইডে সংরক্ষণ করে (যেমন, localStorage বা cookie)।

Subsequent Requests: পরে, যখন ব্যবহারকারী কোনো প্রোটেক্টেড রিসোর্স অ্যাক্সেস করতে চায়, তখন ক্লায়েন্ট সেই token কে Authorization: Bearer <token> ফরম্যাটে header হিসেবে পাঠায়।

Server Side: সার্ভার এই token কে ভেরিফাই করে এবং যদি টোকেন বৈধ হয়, তখন ব্যবহারকারীকে অ্যাক্সেস দেয়।
    */
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      /*
const text = "Bearer abc123token";
যদি তুমি split(' ') ব্যবহার করো, তাহলে এটি সেই স্ট্রিংটি স্পেস দিয়ে বিভক্ত করবে।

উদাহরণ:
const parts = text.split(' ');
console.log(parts);
এটি আউটপুট হবে:

["Bearer", "abc123token"]
এখানে split স্পেস (বা যে কোনো delimiter) দিয়ে স্ট্রিংকে দুইটি অংশে ভাগ করেছে: প্রথম অংশ "Bearer" এবং দ্বিতীয় অংশ "abc123token"।

      */

      //verify token
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "User Not Found",
          statusCode: 401,
        });
      }
      next();
    } catch (error) {
      console.error("Auth Middleware error: ", error.message);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          error: "Token Has Expired",
          statusCode: 401,
        });
      }

      return res.status(401).json({
        success: false,
        error: "Not Authorized , Token Failed",
        statusCode: 401,
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      error: "Not Authorized , not Toekn",
    });
  }
};
module.exports = protect;
