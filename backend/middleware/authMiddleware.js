const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Немає токена, доступ заборонено" });
  }

  try {
    const jwtToken = token.replace("Bearer ", "");
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

    console.log("Decoded token:", decoded); 

    if (!decoded.id || !decoded.role) {  
      return res.status(400).json({ message: "Некоректний токен" });
    }

    req.user = { id: decoded.id, role: decoded.role }; 

    next();
  } catch (err) {
    return res.status(400).json({ message: "Невірний токен" });
  }
};

module.exports = authMiddleware;
