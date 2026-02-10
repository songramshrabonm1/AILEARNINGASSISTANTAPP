const express = require("express");
const body = require("express-validator");
const {
  register,
  login,
  getProfile,
  updateUserProfile,
  changePassword,
} = require("../controllers/authController");
const protect = require("../middleware/auth");

const router = express.Router();

const registrationValidationMiddleware = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("UserName Must Be AtLeast 3 character"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please Provide a valid Email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password Must Be at least 6 Character"),
];

const loginValidationMiddleware = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please Provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password Must Be Atleast 6 character"),
];

// public routes
router.post("/register", registrationValidationMiddleware, register);
router.post("/login", loginValidationMiddleware, login);

//protected routes
router.get("/profile",  protect,getProfile);
router.put("/profile", protect,updateUserProfile);
router.post("/change-password", protect, changePassword);

module.exports = router;
