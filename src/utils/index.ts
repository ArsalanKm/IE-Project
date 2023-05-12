import Admin from '../models/admin';
import Teacher from '../models/teacher';
import Student from '../models/student';
import Manager from '../models/manager';

import { IStudent, IPerson, IManager, ITeacher } from 'models/_';

export type ModelType = 'admin' | 'teacher' | 'student' | 'manager';

export const userTypeUtil = (user: ModelType) => {
  let model;
  switch (user) {
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
  return model;
};

export const interfaceTypeUtil = (
  data: any,
  value: ModelType
):
  | (IPerson & { userId: string })
  | (ITeacher & { userId: string })
  | (IStudent & { userId: string })
  | (IManager & { userId: string }) => {
  let result;
  switch (value) {
    case 'admin':
      result = data as IPerson & { userId: string };
      break;
    case 'teacher':
      result = data as ITeacher & { userId: string };
      break;
    case 'student':
      result = data as IStudent & { userId: string };
      break;
    case 'manager':
      result = data as IManager & { userId: string };
      break;
  }
  return result;
};
