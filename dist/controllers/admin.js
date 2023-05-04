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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_1 = __importDefault(require("../models/admin"));
const router = express_1.default.Router();
router.post('/create-admin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    let data;
    try {
        data = yield new admin_1.default({
            name: body.name,
            password: body.password,
            familyName: body.familyName,
            universityId: body.universityId,
            email: body.email,
            phoneNumber: body.phoneNumber,
        }).save();
    }
    catch (error) {
        res.status(500).send({
            message: 'Some error occurred while creating the admin.',
        });
    }
    let token;
    try {
        token = jsonwebtoken_1.default.sign({ name: body.name, password: body.password }, 'secret', {
            expiresIn: '100d',
        });
    }
    catch (error) {
        res.status(500).send({
            message: 'something went run while creating token',
        });
    }
    res.status(200).send({ data, message: 'admin created successfull=y', token });
}));
exports.default = router;
