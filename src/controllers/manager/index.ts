import express, { Request, Response } from 'express';

import { authMiddleware } from '../../middlewares/jwt';

import { ISubject } from 'models/_';

import { loginHandler } from '../login';
import { Subject } from '../../models/subject';
import Student from '../../models/student';
import Professor from '../../models/student';

const router = express.Router();

router.post('/login', (req, res) => loginHandler('manager', req, res));

router.post('/course', authMiddleware, async (req: Request, res: Response) => {
  const { name, value, preRequests, sameRequests } = req.body as ISubject & {
    id: string;
  };
  try {
    const subject = await new Subject({
      name,
      value,
      preRequests,
      sameRequests,
    }).save();
    res.status(200).send({ message: 'created successfully', subject });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
});

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

router.get(
  '/student/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const student = await Student.findById(id).exec();
      res.status(200).send({ student });
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

router.get('/students', authMiddleware, async (req: Request, res: Response) => {
  try {
    const students = await Student.find({});
    res.status(200).send({ students });
  } catch (error) {
    res.status(500).send({ message: 'server error' });
  }
});

router.get(
  '/professors',
  authMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const professors = await Professor.find({});
      res.status(200).send({ professors });
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

router.get(
  '/professor',
  authMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const professor = await Professor.findById(id).exec();
      res.status(200).send({ professor });
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

router.put(
  '/course/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, value, preRequests, sameRequests } = req.body as ISubject & {
      id: string;
    };
    try {
      const subject = await Subject.findByIdAndUpdate(id, {
        name,
        value,
        preRequests,
        sameRequests,
      }).exec();

      if (!subject) {
        res.status(400).send({ message: 'There is no course with that id' });
      }
      res.status(200).send({ message: 'updated successfully', subject });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);

router.delete(
  '/course/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    const data = req.body as { id: string };
    const { id } = req.params;

    try {
      const result = await Subject.findByIdAndDelete(id).exec();
      if (result) {
        res.status(200).send({ data: result, message: 'deleted successfully' });
      } else {
        res.status(400).send({ message: 'course does not exists' });
      }
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

export default router;
