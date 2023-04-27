"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectionString = 'mongodb://0.0.0.0:27017/';
mongoose_1.default
    .connect(connectionString, { dbName: 'mern-app' })
    .then(() => console.log('successfully connected to database'))
    .catch((e) => console.error('Connection error to database', e));
const db = mongoose_1.default.connection;
exports.default = db;
