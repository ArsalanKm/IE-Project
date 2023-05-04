"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_1 = require("../../middlewares/jwt");
const utils_1 = require("../utils");
const router = express_1.default.Router();
router.post('/login', (req, res) => (0, utils_1.loginHandler)('student', req, res));
router.get('/courses', jwt_1.authMiddleware, (req, res) => (0, utils_1.getListUtil)('subject', req, res));
router.get('/course/:id', jwt_1.authMiddleware, (req, res) => (0, utils_1.getByIdUtil)('subject', req, res));
router.put('/student/:id', jwt_1.authMiddleware, (req, res) => (0, utils_1.updateUtil)('student', req, res));
exports.default = router;
