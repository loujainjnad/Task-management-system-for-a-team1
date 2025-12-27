/**
 * Rate Limit Configuration
 * إعدادات Rate Limiting
 */
const rateLimit = require('express-rate-limit');

// Rate limiter عام
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // 100 طلب لكل IP
  message: {
    success: false,
    message: 'تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter للمصادقة
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 5, // 5 محاولات فقط
  message: {
    success: false,
    message: 'تم تجاوز الحد المسموح من محاولات تسجيل الدخول. يرجى المحاولة بعد 15 دقيقة.',
  },
  skipSuccessfulRequests: true,
});

// Rate limiter لإعادة تعيين كلمة المرور
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // ساعة واحدة
  max: 3, // 3 محاولات فقط
  message: {
    success: false,
    message: 'تم تجاوز الحد المسموح من طلبات إعادة تعيين كلمة المرور. يرجى المحاولة بعد ساعة.',
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
};

