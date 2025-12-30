const express = require('express');
const authController = require("../controllers/auth.controller");
const { requireAuth, authorize } = require("../middleware/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// TODO: Add auth routes here
// Example:

router.post('/login', asyncHandler(authController.login));
router.post('/logout',requireAuth, asyncHandler(authController.logout));

module.exports = router;

