import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        errorMessage: "Not authorized. Please, log in again.",
      });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      req.body.userId = tokenDecode.id;
    } else {
      return res.status(401).json({
        errorMessage: "Wrong JWT Token. Please, log in again.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};

export default userAuth;
