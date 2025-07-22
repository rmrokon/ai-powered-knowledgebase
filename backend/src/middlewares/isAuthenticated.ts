import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env-constants';
import { IUser } from '../modules/users/types';

export default function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    if(!JWT_SECRET) return res.status(500).json({message: "Internal Server Error"});
    const decoded = jwt.verify(token, JWT_SECRET);
    req.auth.user = decoded as Omit<IUser, "createdAt">;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Unauthorized Access' });
  }
};
