/**
 * Middleware для перевірки, чи користувач є адміністратором.
 *
 * @param {import('express').Request} req - HTTP-запит
 * @param {import('express').Response} res - HTTP-відповідь
 * @param {Function} next - Функція переходу до наступного middleware
 * @returns {void}
 */
const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Доступ заборонено. Необхідні права адміністратора." });
    }
  
    next(); 
  };
  
  module.exports = adminMiddleware;
  