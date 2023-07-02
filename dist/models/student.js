"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = require("./_");
const studentSchema = (0, _1.passwordMiddleware)(new mongoose_1.default.Schema(Object.assign(Object.assign({}, _1.PersonSchemaType), { educationDegree: {
        type: String,
        required: true,
        enum: ['کارشناسی', 'ارشد', 'دکتری'],
    }, enteranceYear: { type: String, required: true }, semester: { type: String, required: true }, average: { type: Number, required: true }, faculty: { type: String, required: true }, field: { type: String, required: true }, leadTeacher: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Teacher',
        default: null,
    } }), {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
}));
const Student = mongoose_1.default.model('Student', studentSchema);
exports.default = Student;
