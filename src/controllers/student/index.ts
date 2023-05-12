import express, { Request, Response, NextFunction } from 'express';

import { authMiddleware } from '../../middlewares/jwt';
import { authorizationMiddleware } from '../../middlewares/authorization';
import { loginHandler, updateUtil } from '../utils';
import { Subject } from '../../models/subject';
import Student from '../../models/student';

const router = express.Router();

router.post('/login', (req, res) => loginHandler('student', req, res));

router.get(
  '/courses',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('student', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      if (userId) {
        const student = await Student.findById(userId).exec();
        console.log(student);

        const courses = await Subject.find({})
          .where({
            field: student?.field,
          })
          .populate('preRequests')
          .exec();
        res.status(200).send({ courses });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);

router.get(
  '/all-courses',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('student', req, res, next),
  async (req: Request, res: Response) => {
    const { field } = req.query;
    try {
      const courses = field
        ? await Subject.find({})
            .where({
              field: field as string,
            })
            .populate('preRequests')
            .exec()
        : await Subject.find({}).populate('preRequests').exec();
      res.status(200).send({ courses });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);

router.get(
  '/course/:id',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('student', req, res, next),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const course = await Subject.findById(id).exec();
      res.status(200).send({ course });
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

router.put(
  '/student/:id',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('student', req, res, next),
  (req: Request, res: Response) => updateUtil('student', req, res)
);

export default router;
