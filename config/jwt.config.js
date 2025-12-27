/**
 * JWT Configuration
 * إعدادات JWT
 */
module.exports = {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRE || '7d',
  refreshExpiresIn: '30d',
};

