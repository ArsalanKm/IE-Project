"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const termSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    termUsersId: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Student',
        },
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Teacher',
        },
    ],
    termCourses: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'SemesterSubject',
        },
    ],
    preRegistrationCourses: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'SemesterSubject',
        },
    ],
    preRegistrationRequests: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'RegisterRequest' },
    ],
    RegistratoinRequests: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'PreRegisterRequest' },
    ],
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
const Term = mongoose_1.default.model('Term', termSchema);
exports.default = Term;
