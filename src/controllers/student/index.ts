import express, { Request, Response } from 'express';

import { IStudent } from 'models/_';

import { authMiddleware } from '../../middlewares/jwt';
import { Subject } from '../../models/subject';
import Student from '../../models/student';

const router = express.Router();

router.get('/courses', authMiddleware, async (req: Request, res: Response) => {
  try {
    const courses = await Subject.find({}).populate('preRequests').exec();
    res.status(200).send({ courses });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
});

router.get(
  '/course/:id',
  authMiddleware,
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
  async (req: Request, res: Response) => {
    const data = req.body as IStudent & { id: string };
    const { id } = req.params;

    try {
      const existUser = await Student.findByIdAndUpdate(id, data);
      if (!existUser) {
        res.status(400).send({ message: 'There is no user with that id' });
      }
      res.status(200).send(existUser);
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

export default router;
