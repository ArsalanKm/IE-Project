"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const facultySchema = new mongoose_1.default.Schema({
    name: { type: String },
    field: { type: String },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
const Faculty = mongoose_1.default.model('Faculty', facultySchema);
exports.default = Faculty;
