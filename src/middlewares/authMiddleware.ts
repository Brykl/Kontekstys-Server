import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

interface AuthenticatedRequest extends Request {
  user?: any; // можно потом уточнить
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Нет токена авторизации" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.secretToken);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Неверный или просроченный токен" });
  }
};
