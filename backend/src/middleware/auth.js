const { verifyToken } = require("../utils/jwt");
const { findUserById } = require("../store");

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token  = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = verifyToken(token);
    const user    = await findUserById(decoded.id);
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user = user.toJSON();
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
