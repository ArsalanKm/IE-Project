"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemesterSubject = exports.Subject = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const subjectType = {
    name: { type: String, required: true },
    value: { type: Number, required: true },
    preRequests: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Subject',
            default: null,
        },
    ],
    sameRequests: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Subject',
            default: null,
        },
    ],
    field: { type: String, required: true },
};
const subjectSchema = new mongoose_1.default.Schema(Object.assign({}, subjectType));
exports.Subject = mongoose_1.default.model('Subject', subjectSchema);
const semesterSubjectSchema = new mongoose_1.default.Schema(Object.assign(Object.assign({}, subjectType), { classTime: { type: String, required: true }, examTime: { type: String, required: true }, examLocation: { type: String, required: false, default: 'null' }, teacher: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Teacher', default: null }, capacity: { type: Number, default: 0 }, semester: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Term',
        default: null,
    }, preRegisterStudents: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: 'Student', default: null },
    ], registerStudents: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: 'Student', default: null },
    ] }), {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
exports.SemesterSubject = mongoose_1.default.model('SemesterSubject', semesterSubjectSchema);
