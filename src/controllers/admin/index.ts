import express, { Request, Response,NextFunction } from 'express';

import { createUtil, loginHandler } from '../utils';

import { authMiddleware } from '../../middlewares/jwt';
import { authorizationMiddleware } from '../../middlewares/authorization';
import { Subject } from '../../models/subject';

import professorRouter from './professor';
import studentRouter from './student';
import managerRouter from './manager';



const router = express.Router();

// TO DO admin authorization
router.use(professorRouter);
router.use(studentRouter);
router.use(managerRouter);

router.post('/create-admin', async (req: Request, res: Response) =>
  createUtil('admin', req, res)
);

router.post('/login', (req: Request, res: Response) =>
  loginHandler('admin', req, res)
);

router.get(
  '/courses',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('admin', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const courses = await Subject.find({}).populate('preRequests').exec();
      res.status(200).send({ courses });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);
export default router;
