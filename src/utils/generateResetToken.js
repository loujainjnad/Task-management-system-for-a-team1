const crypto = require('crypto');

/**
 * Generate Password Reset Token
 * إنشاء رمز إعادة تعيين كلمة المرور
 */
const generateResetToken = () => {
  // إنشاء رمز عشوائي قوي
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // تشفير الرمز للتخزين في قاعدة البيانات
  const hashedResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // تاريخ انتهاء الصلاحية (افتراضي: ساعة واحدة)
  const resetTokenExpire = Date.now() + (process.env.EXPIRE_ACCESS_TOKEN || 3600000);

  return {
    resetToken,        // الرمز الأصلي (يُرسل للمستخدم)
    hashedResetToken, // الرمز المشفر (يُخزن في قاعدة البيانات)
    resetTokenExpire, // تاريخ انتهاء الصلاحية
  };
};

/**
 * Hash Reset Token
 * تشفير رمز إعادة التعيين
 */
const hashResetToken = (token) => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};

module.exports = {
  generateResetToken,
  hashResetToken,
};

