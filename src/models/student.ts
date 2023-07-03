import mongoose from 'mongoose';

import { passwordMiddleware, PersonSchemaType } from './_';

const studentSchema = passwordMiddleware(
  new mongoose.Schema(
    {
      ...PersonSchemaType,
      educationDegree: {
        type: String,
        required: true,
        enum: ['کارشناسی', 'ارشد', 'دکتری'],
      },
      enteranceYear: { type: String, required: true },
      semester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Term',
        default: null,
      },
      average: { type: Number, required: false },
      faculty: { type: String, required: false },
      field: { type: String, required: false },
      leadTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        default: null,
      },
      termCourses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'SemesterSubject',
          default: null,
          required: false,
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
  )
);

const Student = mongoose.model('Student', studentSchema);

export default Student;
