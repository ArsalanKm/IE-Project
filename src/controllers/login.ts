import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { LoginType } from 'models/_';
import Admin from '../models/admin';
import Teacher from '../models/teacher';
import Student from '../models/student';
import Manager from '../models/manager';

export const loginHandler = async (
  userType: 'admin' | 'teacher' | 'student' | 'manager',
  req: Request,
  res: Response
) => {
  const body = req.body as LoginType;

  let model;
  console.log(userType);

  switch (userType) {
    case 'admin':
      model = Admin;
      break;
    case 'teacher':
      model = Teacher;
      break;
    case 'student':
      model = Student;
      break;
    case 'manager':
      model = Manager;
      break;
    default:
      break;
  }

  try {
    const user = await model?.findOne({ universityId: body.universityId });
    if (user) {
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
    } else {
      res.status(401).send({ message: 'There is no user with that name' });
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
