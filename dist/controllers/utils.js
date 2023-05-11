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
exports.createUtil = exports.updateUtil = exports.deleteItemUtil = exports.getListUtil = exports.getByIdUtil = exports.loginHandler = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const admin_1 = __importDefault(require("../models/admin"));
const teacher_1 = __importDefault(require("../models/teacher"));
const student_1 = __importDefault(require("../models/student"));
const manager_1 = __importDefault(require("../models/manager"));
const loginHandler = (userType, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const model = userTypeUtil(userType);
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
            res.status(200).send({ message: ' logged in successfully', token });
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
const getByIdUtil = (userType, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const model = userTypeUtil(userType);
    try {
        const data = yield (model === null || model === void 0 ? void 0 : model.findById(id).exec());
        res.status(200).send({ data });
    }
    catch (error) {
        res.status(500).send({ message: 'server error' });
    }
});
exports.getByIdUtil = getByIdUtil;
const getListUtil = (userType, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const model = userTypeUtil(userType);
    try {
        const data = yield (model === null || model === void 0 ? void 0 : model.find({}));
        res.status(200).send({ data });
    }
    catch (error) {
        res.status(500).send({ message: 'server error' });
    }
});
exports.getListUtil = getListUtil;
const deleteItemUtil = (userType, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const model = userTypeUtil(userType);
    const { id } = req.params;
    try {
        const result = yield (model === null || model === void 0 ? void 0 : model.findByIdAndDelete(id).exec());
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
});
exports.deleteItemUtil = deleteItemUtil;
const updateUtil = (userType, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const model = userTypeUtil(userType);
    const data = interfaceTypeUtil(req.body, userType);
    const { id } = req.params;
    try {
        const existUser = yield (model === null || model === void 0 ? void 0 : model.findByIdAndUpdate(id, data).exec());
        if (!existUser) {
            res.status(400).send({ message: 'There is no user with that id' });
        }
        res.status(200).send(existUser);
    }
    catch (error) {
        res.status(500).send({ message: 'server error' });
    }
});
exports.updateUtil = updateUtil;
const createUtil = (userType, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const model = userTypeUtil(userType);
    const data = interfaceTypeUtil(req.body, userType);
    const existUser = yield (model === null || model === void 0 ? void 0 : model.findOne({
        universityId: data === null || data === void 0 ? void 0 : data.universityId,
    }).exec());
    if (existUser) {
        res
            .status(400)
            .send({ message: 'Professor exits with same university ID' });
        return;
    }
    try {
        const result = model && (yield new model(data).save());
        res.status(200).send({ message: ' created successfully', data: result });
    }
    catch (error) {
        res.status(500).send({ message: error });
    }
});
exports.createUtil = createUtil;
const interfaceTypeUtil = (data, value) => {
    let result;
    switch (value) {
        case 'admin':
            result = data;
            break;
        case 'teacher':
            result = data;
            break;
        case 'student':
            result = data;
            break;
        case 'manager':
            result = data;
            break;
        default:
            break;
    }
    return result;
};
const userTypeUtil = (user) => {
    let model;
    switch (user) {
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
    return model;
};
