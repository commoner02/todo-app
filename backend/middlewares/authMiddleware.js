import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    if (refreshToken) {
      return res.status(401).json({
        error: "Access token missing",
        code: "ACCESS_TOKEN_MISSING",
        shouldRefresh: true,
      });
    }
    return res.status(401).json({
      error: "Please login",
      code: "LOGIN_REQUIRED",
    });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Access Token expired",
        code: "ACCESSS_TOKEN_EXPIRED",
        shouldRefresh: !!refreshToken,
      });
    }
    return res.status(401).json({
      error: "Invalid token",
      code: "INVALID_TOKEN",
    });
  }
};

export default protect;
