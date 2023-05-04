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
const manager_1 = __importDefault(require("../../models/manager"));
const router = express_1.default.Router();
router.post('/manager', jwt_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const existUser = yield manager_1.default.findOne({
        universityId: data.universityId,
    }).exec();
    if (existUser) {
        res.status(400).send({ message: 'manager exits with same university ID' });
        return;
    }
    try {
        const manager = yield new manager_1.default(Object.assign({}, data)).save();
        res
            .status(200)
            .send({ message: 'manager created successfully', data: manager });
    }
    catch (error) {
        res.status(500).send({ message: error });
    }
}));
router.get('/managers', jwt_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const managers = yield manager_1.default.find({});
        res.status(200).send({ managers });
    }
    catch (error) {
        res.status(500).send({ message: 'server error' });
    }
}));
router.get('/manager/:id', jwt_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { id } = req.params;
    try {
        const manager = yield manager_1.default.findById(id).exec();
        res.status(200).send({ manager });
    }
    catch (error) {
        res.status(500).send({ message: 'server error' });
    }
}));
router.delete('/manager/:id', jwt_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { id } = req.params;
    try {
        const result = yield manager_1.default.findByIdAndDelete(id).exec();
        if (result) {
            res.status(200).send({ data: result, message: 'deleted successfully' });
        }
        else {
            res.status(400).send({ message: 'user does not exists' });
        }
    }
    catch (error) {
        res.status(500).send({ message: 'server error' });
    }
}));
router.put('/manager/:id', jwt_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { id } = req.params;
    try {
        const existUser = yield manager_1.default.findByIdAndUpdate(id, data);
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
