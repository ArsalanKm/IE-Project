import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
const SALT_WORK_FACTOR = 10;

export interface IPerson {
  name: string;
  password: string;
  familyName: string;
  universityId: string;
  email: string;
  phoneNumber: string;
}

export interface IStudent extends IPerson {
  educationDegree: string;
  enteranceYear: string;
  semester: string;
  average: number;
  faculty: string;
  field: string;
}

export interface ITeacher extends IPerson {
  faculty: string;
  field: string;
  rank: string;
}

export interface IManager extends IPerson {
  faculty: string;
}

export interface ISubject {
  name: string;
  value: number;
  preRequests: string;
  sameRequests: string;
  field: string;
}

export interface ISemesterSubject extends ISubject {
  classTime: string;
  examTime: string;
  examLocation: string;
  teacher: ITeacher;
  capacity: number;
  semester: number;
}

export const PersonSchemaType = {
  name: { type: String, required: true },
  familyName: { type: String, required: true },
  password: { type: String, required: true },
  universityId: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
};

export type LoginType = Pick<IPerson, 'universityId' | 'password'>;

export const passwordMiddleware = (schema: Schema) => {
  schema.pre('save', function (next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        // override the cleartext password with the hashed one
        user.password = hash;
        next();
      });
    });
  });

  schema.methods.comparePassword = function (
    candidatePassword: string,
    cb: (req: Error | null, res: boolean) => void
  ) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) {
        return cb(err, false);
      }
      cb(null, isMatch);
    });
  };

  return schema;
};
