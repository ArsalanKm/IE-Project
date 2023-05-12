import { Request, Response, NextFunction } from 'express';

import { validateToken } from '../utils/jwt';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('ss');
  
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer')) {
    const token = auth.slice(7);

    if (token) {
      const tokenData = validateToken(token);
      console.log({ tokenData });

      if (tokenData.valid) {
        req.body.userId = tokenData.id;
        next();
        return;
      } else {
        res.status(401).send({ message: 'UnAuthenticated' });
        return;
      }
    } else {
      res.status(401).send({ message: 'UnAuthenticated' });
      return;
    }
  } else {
    res.status(401).send({ message: 'UnAuthenticated' });
  }
};
