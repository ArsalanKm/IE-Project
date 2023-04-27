import mongoose from 'mongoose';

import { passwordMiddleware, PersonSchemaType } from './_';

const adminSchema = passwordMiddleware(
  new mongoose.Schema({
    ...PersonSchemaType,
  })
);

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
