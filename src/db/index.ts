import mongoose from 'mongoose';
import dotevn from 'dotenv';

dotevn.config();
const { DB_URL, DB_NAME } = process.env;

mongoose
  .connect(DB_URL || '', { dbName: DB_NAME })
  .then(() => console.log('successfully connected to database'))
  .catch((e) => console.error('Connection error to database', e));

const db = mongoose.connection;

export default db;
