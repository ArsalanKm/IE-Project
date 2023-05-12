"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { DB_URL, DB_NAME } = process.env;
mongoose_1.default
    .connect(DB_URL || '', { dbName: DB_NAME })
    .then(() => console.log('successfully connected to database'))
    .catch((e) => console.error('Connection error to database', e));
const db = mongoose_1.default.connection;
exports.default = db;
