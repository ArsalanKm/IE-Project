"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = require("./_");
const teacherSchema = (0, _1.passwordMiddleware)(new mongoose_1.default.Schema(Object.assign(Object.assign({}, _1.PersonSchemaType), { faculty: { type: String, required: true }, field: { type: String, required: true }, rank: { type: Number, required: true }, students: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Student',
        },
    ] }), {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
}));
const Teacher = mongoose_1.default.model('Teacher', teacherSchema);
exports.default = Teacher;
