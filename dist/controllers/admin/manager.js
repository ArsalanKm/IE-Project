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
router.post('/manager', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('admin', req, res, next), (req, res) => (0, utils_1.createUtil)('manager', req, res));
router.get('/managers', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('admin', req, res, next), (req, res) => (0, utils_1.getListUtil)('manager', req, res));
router.get('/manager/:id', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('admin', req, res, next), (req, res) => (0, utils_1.getByIdUtil)('manager', req, res));
router.delete('/manager/:id', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('admin', req, res, next), (req, res) => (0, utils_1.deleteItemUtil)('manager', req, res));
router.put('/manager/:id', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('admin', req, res, next), (req, res) => (0, utils_1.updateUtil)('manager', req, res));
exports.default = router;
