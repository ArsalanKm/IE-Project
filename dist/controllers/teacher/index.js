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
const utils_1 = require("../utils");
const jwt_1 = require("../../middlewares/jwt");
const teacher_1 = __importDefault(require("../../models/teacher"));
const router = express_1.default.Router();
router.get('/courses', jwt_1.authMiddleware, (req, res) => (0, utils_1.getListUtil)('subject', req, res));
router.get('/course/:id', jwt_1.authMiddleware, (req, res) => (0, utils_1.getByIdUtil)('subject', req, res));
router.put('/professor/:id', jwt_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { id } = req.params;
    try {
        const existUser = yield teacher_1.default.findByIdAndUpdate(id, data);
        if (!existUser) {
            res.status(400).send({ message: 'There is no user with that id' });
        }
        res.status(200).send(existUser);
    }
    catch (error) {
        res.status(500).send({ message: 'server error' });
    }
}));
exports.default = router;
