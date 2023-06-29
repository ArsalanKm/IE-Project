import mongoose from 'mongoose';

import { passwordMiddleware, PersonSchemaType } from './_';

const teacherSchema = passwordMiddleware(
  new mongoose.Schema(
    {
      ...PersonSchemaType,
      faculty: { type: String, required: true },
      field: { type: String, required: true },
      rank: { type: Number, required: true },
      students: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
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

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;
