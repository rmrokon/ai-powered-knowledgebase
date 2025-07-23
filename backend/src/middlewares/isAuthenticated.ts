import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env-constants';
import { IUser } from '../modules/users/types';
import { credentialService, userService } from '../modules/bootstrap';
import { ICredentialTokenPayload } from '../modules/credentials/types';

export default async function isAuthenticated(
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.decode(token) as ICredentialTokenPayload;
    if (!decoded?.uid) return res.status(403).json({ message: 'Unauthorized Access' });

    const user = await userService.getUserById(decoded.uid);
    if (!user) return res.status(403).json({ message: 'Unauthorized Access' });

    const credential = await credentialService.getCredentialByUserId(user.id);
    if (!credential?.password) return res.status(403).json({ message: 'Unauthorized Access' });

    const verified = jwt.verify(token, JWT_SECRET + credential.password) as ICredentialTokenPayload;
    if(!verified) return res.status(403).json({message: 'Unauthorized Access'})
    req.auth = { user }; 
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: 'Unauthorized Access' });
  }
}
