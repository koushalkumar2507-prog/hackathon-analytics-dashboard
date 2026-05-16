const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {

  const authHeader =
    req.headers.authorization;

  // No token
  if (!authHeader) {

    return res.status(401).json({

      success: false,
      message: "Access denied"

    });

  }

  // Extract token
  const token =
    authHeader.split(" ")[1];

  try {

    // Verify token
    const verified =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    // Save user data
    req.user = verified;

    next();

  }

  catch (error) {

    return res.status(401).json({

      success: false,
      message: "Invalid token"

    });

  }

}

module.exports = verifyToken;