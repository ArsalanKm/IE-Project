import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { IPerson, ITeacher } from 'models/_';

import { authMiddleware } from '../middlewares/jwt';

import Admin from '../models/admin';
import Teacher from '../models/teacher';

const router = express.Router();

// TO DO admin authorization

router.post('/create-admin', async (req: Request, res: Response) => {
  const { name, password, familyName, universityId, email, phoneNumber } =
    req.body as IPerson;

  try {
    const data = await new Admin({
      name,
      password,
      familyName,
      universityId,
      email,
      phoneNumber,
    }).save();
    if (data) {
      res.status(200).send({ data, message: 'admin created successfully' });
    }
  } catch (error) {
    res.status(500).send({
      message: 'Some error occurred while creating the admin.',
    });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const body = req.body as Pick<IPerson, 'universityId' | 'password'>;
  try {
    const user = await Admin.findOne({
      universityId: body.universityId,
    }).exec();
    if (user) {
      console.log(body.password, user.password);
      const isValidPass = await bcrypt.compare(body.password, user.password);

      if (!isValidPass) {
        res.status(401).send({ message: 'password is wrong' });
        return;
      }
      let token;
      try {
        token = jwt.sign({ id: user._id }, 'secret', {
          expiresIn: '100d',
        });
      } catch (error) {
        res.status(500).send({
          message: 'something went run while creating token',
        });
      }
      res.status(200).send({ message: 'admin logged in successfully', token });
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: 'There is no user with that name' });
  }
});

router.post(
  '/professor',
  authMiddleware,
  async (req: Request, res: Response) => {
    const data = req.body as ITeacher & { id: string };

    const existUser = await Teacher.findOne({
      universityId: data.universityId,
    }).exec();

    if (existUser) {
      res
        .status(400)
        .send({ message: 'Professor exits with same university ID' });
      return;
    }
    try {
      const teacher = await new Teacher({ ...data } as ITeacher).save();
      res
        .status(200)
        .send({ message: 'professor created successfully', data: teacher });
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }
);

router.get(
  '/professors',
  authMiddleware,
  async (req: Request, res: Response) => {
    const data = req.body as { id: string };
    try {
      const professors = await Teacher.find({});
      res.status(200).send({ professors });
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

router.get(
  '/professor/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    const data = req.body as { id: string };
    const { id } = req.params;

    try {
      const professor = await Teacher.findById(id).exec();
      res.status(200).send({ professor });
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

router.delete(
  '/professor/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    const data = req.body as { id: string };
    const { id } = req.params;

    try {
      const deletedCount = await Teacher.deleteOne({ id }).exec();
      res.status(200).send({ deletedCount });
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

router.put(
  '/professor/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    const data = req.body as ITeacher & { id: string };
    const { id } = req.params;

    try {
      const existUser = await Teacher.findByIdAndUpdate(id, data);
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
