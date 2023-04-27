"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = require("./_");
const teacherSchema = new mongoose_1.default.Schema(Object.assign(Object.assign({}, _1.PersonSchemaType), { faculty: { type: String, required: true }, field: { type: String, required: true }, rank: { type: String, required: true } }));
const Teacher = mongoose_1.default.model('Teacher', teacherSchema);
exports.default = Teacher;
