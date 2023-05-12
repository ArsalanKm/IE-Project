import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { LoginType, IStudent, IPerson, IManager, ITeacher } from 'models/_';

import {
  loginValidator,
  managerDataValidator,
  personDataValidator,
  studentDataValidator,
  teacherDataValidator,
} from '../utils/validator';

import { ModelType, userTypeUtil, interfaceTypeUtil } from '../utils';

export const loginHandler = async (
  userType: ModelType,
  req: Request,
  res: Response
) => {
  const body = req.body as LoginType;
  const { valid, message } = loginValidator(body);

  if (!valid) {
    res.status(400).send({ message });
    return;
  }

  const model = userTypeUtil(userType);

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
      res.status(200).send({ message: ' logged in successfully', token });
    } else {
      res.status(401).send({ message: 'There is no user with that name' });
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const getByIdUtil = async (
  userType: ModelType,
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const model = userTypeUtil(userType);

  try {
    const data = await model?.findById(id).exec();
    res.status(200).send({ data });
  } catch (error) {
    res.status(500).send({ message: 'server error' });
  }
};

export const getListUtil = async (
  userType: ModelType,
  req: Request,
  res: Response
) => {
  const model = userTypeUtil(userType);
  try {
    const data = await model?.find({});
    res.status(200).send({ data });
  } catch (error) {
    res.status(500).send({ message: 'server error' });
  }
};

export const deleteItemUtil = async (
  userType: ModelType,
  req: Request,
  res: Response
) => {
  const model = userTypeUtil(userType);
  const { id } = req.params;

  try {
    const result = await model?.findByIdAndDelete(id).exec();
    if (result) {
      res.status(200).send({ data: result, message: 'deleted successfully' });
    } else {
      res.status(400).send({ message: 'user does not exists' });
    }
  } catch (error) {
    res.status(500).send({ message: 'server error' });
  }
};

export const updateUtil = async (
  userType: ModelType,
  req: Request,
  res: Response
) => {
  const model = userTypeUtil(userType);
  const data = interfaceTypeUtil(req.body, userType);

  if (data) {
    let valid, message, result;
    if (userType === 'admin') {
      result = personDataValidator(data);
    } else if (userType === 'manager') {
      result = managerDataValidator(data as IManager & { userId: string });
    } else if (userType === 'student') {
      result = studentDataValidator(data as IStudent & { userId: string });
    } else {
      result = teacherDataValidator(data as ITeacher & { userId: string });
    }

    valid = result.valid;
    message = result.message;
    if (!valid) {
      // ts-ignore
      res.status(400).send({ message });
      return;
    }
  }

  const { id } = req.params;

  try {
    const existUser = await model?.findByIdAndUpdate(id, data).exec();
    if (!existUser) {
      res.status(400).send({ message: 'There is no user with that id' });
    }
    res.status(200).send(existUser);
  } catch (error) {
    res.status(500).send({ message: 'server error' });
  }
};

export const createUtil = async (
  userType: ModelType,
  req: Request,
  res: Response
) => {
  const model = userTypeUtil(userType);

  const data = interfaceTypeUtil(req.body, userType);
  if (data) {
    let valid, message, result;
    if (userType === 'admin') {
      result = personDataValidator(data);
    } else if (userType === 'manager') {
      result = managerDataValidator(data as IManager & { userId: string });
    } else if (userType === 'student') {
      result = studentDataValidator(data as IStudent & { userId: string });
    } else {
      result = teacherDataValidator(data as ITeacher & { userId: string });
    }

    valid = result.valid;
    message = result.message;
    if (!valid) {
      // ts-ignore
      res.status(400).send({ message });
      return;
    }
  }
  const existUser = await model
    ?.findOne({
      universityId: data?.universityId,
    })
    .exec();

  if (existUser) {
    res
      .status(400)
      .send({ message: 'Professor exits with same university ID' });
    return;
  }
  try {
    const result = model && (await new model(data).save());
    res.status(200).send({ message: ' created successfully', data: result });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
