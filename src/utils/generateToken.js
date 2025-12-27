const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 * إنشاء رمز JWT للمستخدم
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { 
      userId, 
      role 
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

/**
 * Generate Refresh Token (optional)
 * إنشاء رمز تحديث (اختياري)
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

module.exports = {
  generateToken,
  generateRefreshToken,
};

