import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema(
  {
    name: { type: String },
    field: { type: String },
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

const Faculty = mongoose.model('Faculty', facultySchema);

export default Faculty;
