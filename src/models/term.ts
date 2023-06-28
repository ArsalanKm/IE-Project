import mongoose from 'mongoose';

const termSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    termUsersId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    termCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SemesterSubject',
      },
    ],
    preRegistrationCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SemesterSubject',
      },
    ],
    preRegistrationRequests: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'RegisterRequest' },
    ],
    RegistratoinRequests: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'PreRegisterRequest' },
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
