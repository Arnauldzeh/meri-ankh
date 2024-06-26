const jwt = require("jsonwebtoken");
const Admin = require("../model/admin");

const authenticateAdmin = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Assurez-vous de définir votre secret JWT dans votre environnement
    const admin = await Admin.findOne({
      username: decoded.username,
    });
    if (!admin) {
      return res
        .status(401)
        .json({ message: "Admin not found, authorization denied" });
    }
    req.admin = admin; // Ajoute l'admin à la requête pour utilisation ultérieure
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin resource. Access denied" });
  }
  next();
};

module.exports = { authenticateAdmin, isAdmin };
