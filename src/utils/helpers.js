/**
 * Helper Functions - دوال مساعدة عامة
 */

/**
 * Sanitize Input - تنظيف المدخلات من XSS
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitize Object - تنظيف كائن من XSS
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'string') {
        sanitized[key] = sanitizeInput(obj[key]);
      } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        sanitized[key] = sanitizeObject(obj[key]);
      } else if (Array.isArray(obj[key])) {
        sanitized[key] = obj[key].map((item) =>
          typeof item === 'string' ? sanitizeInput(item) : item
        );
      } else {
        sanitized[key] = obj[key];
      }
    }
  }
  return sanitized;
};

/**
 * Format Date - تنسيق التاريخ
 */
const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

/**
 * Calculate Days Between Dates - حساب الأيام بين تاريخين
 */
const daysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

/**
 * Generate Random String - إنشاء نص عشوائي
 */
const generateRandomString = (length = 10) => {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
};

/**
 * Validate Email - التحقق من صحة البريد الإلكتروني
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate ObjectId - التحقق من صحة ObjectId
 */
const validateObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

/**
 * Remove Sensitive Data - إزالة البيانات الحساسة
 */
const removeSensitiveData = (user) => {
  if (!user || typeof user !== 'object') return user;
  
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;
  delete userObj.resetPasswordToken;
  delete userObj.resetPasswordExpire;
  return userObj;
};

module.exports = {
  sanitizeInput,
  sanitizeObject,
  formatDate,
  daysBetween,
  generateRandomString,
  validateEmail,
  validateObjectId,
  removeSensitiveData,
};

