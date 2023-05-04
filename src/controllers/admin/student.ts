import express, { Request, Response } from 'express';

import { IStudent } from 'models/_';

import { authMiddleware } from '../../middlewares/jwt';
import Student from '../../models/student';

const router = express.Router();

router.post('/student', authMiddleware, async (req: Request, res: Response) => {
  const data = req.body as IStudent & { id: string };

  const existUser = await Student.findOne({
    universityId: data.universityId,
  }).exec();

  if (existUser) {
    res.status(400).send({ message: 'student exits with same university ID' });
    return;
  }
  try {
    const student = await new Student({ ...data } as IStudent).save();
    res
      .status(200)
      .send({ message: 'student created successfully', data: student });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.get('/students', authMiddleware, async (req: Request, res: Response) => {
  const data = req.body as { id: string };
  try {
    const students = await Student.find({});
    res.status(200).send({ students });
  } catch (error) {
    res.status(500).send({ message: 'server error' });
  }
});

router.get(
  '/student/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    const data = req.body as { id: string };
    const { id } = req.params;

    try {
      const student = await Student.findById(id).exec();
      res.status(200).send({ student });
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

router.delete(
  '/student/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    const data = req.body as { id: string };
    const { id } = req.params;

    try {
      const result = await Student.findByIdAndDelete(id).exec();
      if (result) {
        res.status(200).send({ data: result, message: 'deleted successfully' });
      } else {
        res.status(400).send({ message: 'user does not exists' });
      }
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
