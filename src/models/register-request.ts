import mongoose from 'mongoose';

import Student from './student';

const registerSchema = new mongoose.Schema(
  {
    student: { type: Student, required: true },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SemesterSubject',
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

const RegisterRequest = mongoose.model('RegisterSchema', registerSchema);
export default RegisterRequest;
