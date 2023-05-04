import mongoose, { Schema } from 'mongoose';

const subjectType = {
  name: { type: String, required: true },
  value: { type: Number, required: true },
  preRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      default: null,
    },
  ],
  sameRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      default: null,
    },
  ],
  faculty: { type: String, required: true },
};

const subjectSchema = new mongoose.Schema({
  ...subjectType,
});
export const Subject = mongoose.model('Subject', subjectSchema);

const semesterSubjectSchema = new mongoose.Schema({
  ...subjectType,
  classTime: { type: String, required: true },
  examTime: { type: String, required: true },
  examLocation: { type: String, required: true },
  teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' },
  capacity: { type: String, required: true },
  semester: { type: String, required: true },
});

export const SemesterSubject = mongoose.model(
  'SemesterSubject',
  semesterSubjectSchema
);
