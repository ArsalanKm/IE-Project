"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = require("./_");
const managerSchema = (0, _1.passwordMiddleware)(new mongoose_1.default.Schema(Object.assign(Object.assign({}, _1.PersonSchemaType), { faculty: { type: String, required: true } }), {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
}));
const Manager = mongoose_1.default.model('Manager', managerSchema);
exports.default = Manager;
