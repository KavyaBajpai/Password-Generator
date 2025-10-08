import jwt from "jsonwebtoken";

export const userAuth = (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded: ", decoded)
   
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    };

    next(); 
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
