import mongoose from 'mongoose';

const registerSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SemesterSubject',
      },
    ],
    confirmed: {
      type: Boolean,
      required: false,
      default: false,
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

const RegisterRequest = mongoose.model('RegisterRequest', registerSchema);
export default RegisterRequest;
