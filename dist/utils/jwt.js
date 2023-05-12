"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.generateAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtKey = 'secret';
const generateAuthToken = (id) => {
    const token = jsonwebtoken_1.default.sign({ id }, jwtKey, { expiresIn: '100d' });
    return token;
};
exports.generateAuthToken = generateAuthToken;
const validateToken = (token) => {
    try {
        const tokenData = jsonwebtoken_1.default.verify(token, jwtKey);
        if (tokenData) {
            return { id: tokenData.id, valid: true };
        }
        else {
            return { valid: false, id: '' };
        }
    }
    catch (error) {
        console.log('invalid token');
        return { valid: false, id: '' };
    }
};
exports.validateToken = validateToken;
