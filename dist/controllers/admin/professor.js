"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_1 = require("../../middlewares/jwt");
const authorization_1 = require("../../middlewares/authorization");
const utils_1 = require("../utils");
const router = express_1.default.Router();
router.get('/professors', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('admin', req, res, next), (req, res) => (0, utils_1.getListUtil)('teacher', req, res));
router.get('/professor/:id', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('admin', req, res, next), (req, res) => (0, utils_1.getByIdUtil)('teacher', req, res));
router.delete('/professor/:id', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('admin', req, res, next), (req, res) => (0, utils_1.deleteItemUtil)('teacher', req, res));
router.post('/professor', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('admin', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () { return (0, utils_1.createUtil)('teacher', req, res); }));
router.put('/professor/:id', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('admin', req, res, next), (req, res) => (0, utils_1.updateUtil)('teacher', req, res));
exports.default = router;
