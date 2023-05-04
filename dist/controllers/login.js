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
exports.loginHandler = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const admin_1 = __importDefault(require("../models/admin"));
const teacher_1 = __importDefault(require("../models/teacher"));
const student_1 = __importDefault(require("../models/student"));
const manager_1 = __importDefault(require("../models/manager"));
const loginHandler = (userType, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    let model;
    console.log(userType);
    switch (userType) {
        case 'admin':
            model = admin_1.default;
            break;
        case 'teacher':
            model = teacher_1.default;
            break;
        case 'student':
            model = student_1.default;
            break;
        case 'manager':
            model = manager_1.default;
            break;
        default:
            break;
    }
    try {
        const user = yield (model === null || model === void 0 ? void 0 : model.findOne({ universityId: body.universityId }));
        if (user) {
            const isValidPass = yield bcrypt_1.default.compare(body.password, user.password);
            if (!isValidPass) {
                res.status(401).send({ message: 'password is wrong' });
                return;
            }
            let token;
            try {
                token = jsonwebtoken_1.default.sign({ id: user._id }, 'secret', {
                    expiresIn: '100d',
                });
            }
            catch (error) {
                res.status(500).send({
                    message: 'something went run while creating token',
                });
            }
            res.status(200).send({ message: 'admin logged in successfully', token });
        }
        else {
            res.status(401).send({ message: 'There is no user with that name' });
        }
    }
    catch (error) {
        res.status(500).send({ message: error });
    }
});
exports.loginHandler = loginHandler;
