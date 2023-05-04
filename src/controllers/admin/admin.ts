import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { IPerson } from 'models/_';

import Admin from '../../models/admin';

import professorRouter from './professor';
import studentRouter from './student';

const router = express.Router();

// TO DO admin authorization
router.use(professorRouter);
router.use(studentRouter);

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

export default router;
