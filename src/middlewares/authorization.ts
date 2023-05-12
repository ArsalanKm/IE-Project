import { Request, Response, NextFunction } from 'express';

import { ModelType, userTypeUtil } from '../utils';

export const authorizationMiddleware = async (
  userType: ModelType,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('here');

  const { userId } = req.body;
  console.log(userId);

  const model = userTypeUtil(userType);
  try {
    const result = await model?.findById(userId).exec();
    console.log(result);

    if (result) {
      next();
    } else {
      res.status(401).send({ message: 'UnAuthorized User for this endpoint' });
      return;
    }
  } catch (error) {
    res.status(500).send({ message: 'something went wrong', error });
  }
};
