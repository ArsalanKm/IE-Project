"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interfaceTypeUtil = exports.userTypeUtil = void 0;
const admin_1 = __importDefault(require("../models/admin"));
const teacher_1 = __importDefault(require("../models/teacher"));
const student_1 = __importDefault(require("../models/student"));
const manager_1 = __importDefault(require("../models/manager"));
const userTypeUtil = (user) => {
    let model;
    switch (user) {
        case 'admin':
            model = admin_1.default;
            break;
        case 'teacher':
            model = teacher_1.default;
            break;
        case 'student':
            model = student_1.default;
            break;
        case 'manager':
            model = manager_1.default;
            break;
        default:
            break;
    }
    return model;
};
exports.userTypeUtil = userTypeUtil;
const interfaceTypeUtil = (data, value) => {
    let result;
    switch (value) {
        case 'admin':
            result = data;
            break;
        case 'teacher':
            result = data;
            break;
        case 'student':
            result = data;
            break;
        case 'manager':
            result = data;
            break;
    }
    return result;
};
exports.interfaceTypeUtil = interfaceTypeUtil;
