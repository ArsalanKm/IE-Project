"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const registerSchema = new mongoose_1.default.Schema({
    student: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Student',
    },
    courses: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'SemesterSubject',
        },
    ],
    confirmed: {
        type: Boolean,
        required: false,
        default: false,
    },
    term: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Term',
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
const RegisterRequest = mongoose_1.default.model('RegisterRequest', registerSchema);
exports.default = RegisterRequest;
