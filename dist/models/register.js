"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const student_1 = __importDefault(require("./student"));
const subject_1 = require("./subject");
const registerSchema = new mongoose_1.default.Schema({
    student: { type: student_1.default, required: true },
    courses: [subject_1.SemesterSubject]
});
const RegisterRequest = new mongoose_1.default.Model('RegisterSchema', registerSchema);
