import mongoose from 'mongoose';

const termSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    termUsersId: [Number],
    termCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SemesterSubject',
      },
    ],
    preRequestTermCourses: [
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

const Term = mongoose.model('Term', termSchema);

export default Term;
