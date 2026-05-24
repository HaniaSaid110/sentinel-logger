import jwt from "jsonwebtoken";
import Developer from "../models/Developer.js";

/**
 * Protect middleware — verifies the JWT stored in an httpOnly cookie.
 * On success, attaches the authenticated developer to req.developer.
 */
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorised — no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const developer = await Developer.findById(decoded.id);
    if (!developer) {
      return res
        .status(401)
        .json({ message: "Not authorised — developer not found" });
    }

    req.developer = developer;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Not authorised — invalid or expired token" });
  }
};
