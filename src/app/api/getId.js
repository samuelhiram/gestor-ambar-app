import jwt from "jsonwebtoken";

export const getIdByReqHeaders = (req) => {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const userId = decoded.id;
  return userId;
};
