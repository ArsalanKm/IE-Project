import mongoose from 'mongoose';

import { PersonSchemaType } from './_';

const studentSchema = new mongoose.Schema({
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
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
