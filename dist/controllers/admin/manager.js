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
const utils_1 = require("../utils");
const router = express_1.default.Router();
router.post('/manager', jwt_1.authMiddleware, (req, res) => (0, utils_1.createUtil)('manager', req, res));
router.get('/managers', jwt_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return (0, utils_1.getListUtil)('manager', req, res); }));
router.get('/manager/:id', jwt_1.authMiddleware, (req, res) => (0, utils_1.getByIdUtil)('manager', req, res));
router.delete('/manager/:id', jwt_1.authMiddleware, (req, res) => (0, utils_1.deleteItemUtil)('manager', req, res));
router.put('/manager/:id', jwt_1.authMiddleware, (req, res) => (0, utils_1.updateUtil)('manager', req, res));
exports.default = router;
