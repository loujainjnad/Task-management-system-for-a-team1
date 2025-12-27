/**
 * Async Handler - معالج للدوال غير المتزامنة
 * يلتقط الأخطاء تلقائياً ويمررها إلى error handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

