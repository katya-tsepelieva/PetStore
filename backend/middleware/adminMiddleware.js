const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Доступ заборонено. Необхідні права адміністратора." });
    }
  
    next(); 
  };
  
  module.exports = adminMiddleware;
  