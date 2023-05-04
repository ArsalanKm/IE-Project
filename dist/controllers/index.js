"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerRouter = exports.AdminRouter = void 0;
const admin_1 = __importDefault(require("./admin"));
exports.AdminRouter = admin_1.default;
const manager_1 = __importDefault(require("./manager"));
exports.ManagerRouter = manager_1.default;
