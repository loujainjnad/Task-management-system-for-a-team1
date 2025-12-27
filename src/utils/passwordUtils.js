const argon2 = require('argon2');

/**
 * Hash Password using Argon2
 * تشفير كلمة المرور باستخدام Argon2
 */
const hashPassword = async (password) => {
  try {
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,       // 3 iterations
      parallelism: 4,    // 4 threads
    });
    return hashedPassword;
  } catch (error) {
    throw new Error('خطأ في تشفير كلمة المرور');
  }
};

/**
 * Verify Password
 * التحقق من كلمة المرور
 */
const verifyPassword = async (hashedPassword, plainPassword) => {
  try {
    const isValid = await argon2.verify(hashedPassword, plainPassword);
    return isValid;
  } catch (error) {
    return false;
  }
};

/**
 * Validate Password Strength
 * التحقق من قوة كلمة المرور
 */
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`كلمة المرور يجب أن تكون على الأقل ${minLength} أحرف`);
  }
  if (!hasUpperCase) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف كبير على الأقل');
  }
  if (!hasLowerCase) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف صغير على الأقل');
  }
  if (!hasNumbers) {
    errors.push('كلمة المرور يجب أن تحتوي على رقم على الأقل');
  }
  if (!hasSpecialChar) {
    errors.push('كلمة المرور يجب أن تحتوي على رمز خاص على الأقل');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
};

