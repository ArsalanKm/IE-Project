"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = require("./_");
const adminSchema = (0, _1.passwordMiddleware)(new mongoose_1.default.Schema(Object.assign({}, _1.PersonSchemaType)));
const Admin = mongoose_1.default.model('Admin', adminSchema);
exports.default = Admin;
