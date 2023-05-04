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
const teacher_1 = __importDefault(require("../../models/teacher"));
const router = express_1.default.Router();
router.post('/professor', jwt_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const existUser = yield teacher_1.default.findOne({
        universityId: data.universityId,
    }).exec();
    if (existUser) {
        res
            .status(400)
            .send({ message: 'Professor exits with same university ID' });
        return;
    }
    try {
        const teacher = yield new teacher_1.default(Object.assign({}, data)).save();
        res
            .status(200)
            .send({ message: 'professor created successfully', data: teacher });
    }
    catch (error) {
        res.status(500).send({ message: error });
    }
}));
router.get('/professors', jwt_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const professors = yield teacher_1.default.find({});
        res.status(200).send({ professors });
    }
    catch (error) {
        res.status(500).send({ message: 'server error' });
    }
}));
router.get('/professor/:id', jwt_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { id } = req.params;
    try {
        const professor = yield teacher_1.default.findById(id).exec();
        res.status(200).send({ professor });
    }
    catch (error) {
        res.status(500).send({ message: 'server error' });
    }
}));
router.delete('/professor/:id', jwt_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { id } = req.params;
    try {
        const result = yield teacher_1.default.findByIdAndDelete(id).exec();
        if (result) {
            res.status(200).send({ data: result, message: 'deleted successfully' });
        }
        else {
            res
                .status(400)
                .send({ data: result, message: 'teacher does not exits' });
        }
    }
    catch (error) {
        res.status(500).send({ message: 'server error' });
    }
}));
router.put('/professor/:id', jwt_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { id } = req.params;
    try {
        const existUser = yield teacher_1.default.findByIdAndUpdate(id, data).exec();
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
