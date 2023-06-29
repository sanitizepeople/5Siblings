import jwt from "jsonwebtoken";
import env from "../../env.js";
import { errorMessage, status } from "../helpers/status.js";

const verifyToken = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    errorMessage.error = "Token not provide";
    return res.status(status.bad).send(errorMessage);
  }

  try {
    const decoded = jwt.verify(token, env.secret);
    req.user = {
      email: decoded.email,
      user_id: decoded.user_id,
      username: decoded.username,
      is_admin: decoded.is_admin,
    };
    next();
  } catch (error) {
    errorMessage.error = "Authentication Failed";
    return res.status(status.unauthorized).send(errorMessage);
  }
};

export default verifyToken;
