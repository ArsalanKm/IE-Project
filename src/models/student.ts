import mongoose from 'mongoose';

import { passwordMiddleware, PersonSchemaType } from './_';

const studentSchema = passwordMiddleware(
  new mongoose.Schema(
    {
      ...PersonSchemaType,
      educationDegree: {
        type: String,
        required: true,
        enum: ['Bachelor', 'Master', 'PhD'],
      },
      enteranceYear: { type: String, required: true },
      semester: { type: String, required: true },
      average: { type: Number, required: true },
      faculty: { type: String, required: true },
      field: { type: String, required: true },
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
