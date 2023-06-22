import mongoose from 'mongoose';
import Student from './student';

const preRequestSchema = new mongoose.Schema(
  {
    student: { type: Student },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SemesterSubject',
      },
    ],
    term: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Term',
    },
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

const PreRegisterRequests = mongoose.model(
  'PreRegisterRequest',
  preRequestSchema
);

export default PreRegisterRequests;
