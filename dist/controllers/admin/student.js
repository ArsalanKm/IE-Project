"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_1 = require("../../middlewares/jwt");
const authorization_1 = require("../../middlewares/authorization");
const utils_1 = require("../utils");
const router = express_1.default.Router();
router.post('/student', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('admin', req, res, next), (req, res) => (0, utils_1.createUtil)('student', req, res));
router.get('/students', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('admin', req, res, next), (req, res) => (0, utils_1.getListUtil)('student', req, res));
router.get('/student/:id', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('admin', req, res, next), (req, res) => (0, utils_1.getByIdUtil)('student', req, res));
router.delete('/student/:id', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('admin', req, res, next), (req, res) => (0, utils_1.deleteItemUtil)('student', req, res));
router.put('/student/:id', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('admin', req, res, next), (req, res) => (0, utils_1.updateUtil)('student', req, res));
exports.default = router;
