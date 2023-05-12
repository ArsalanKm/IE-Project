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
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = require("../utils/validator");
const jwt_1 = require("../utils/jwt");
const utils_1 = require("../utils");
const loginHandler = (userType, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { valid, message } = (0, validator_1.loginValidator)(body);
    if (!valid) {
        res.status(400).send({ message });
        return;
    }
    const model = (0, utils_1.userTypeUtil)(userType);
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
                token = (0, jwt_1.generateAuthToken)(user._id);
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
    const model = (0, utils_1.userTypeUtil)(userType);
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
    const model = (0, utils_1.userTypeUtil)(userType);
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
    const model = (0, utils_1.userTypeUtil)(userType);
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
const updateUtil = (userType, req, res, checkId = false) => __awaiter(void 0, void 0, void 0, function* () {
    const model = (0, utils_1.userTypeUtil)(userType);
    const data = (0, utils_1.interfaceTypeUtil)(req.body, userType);
    if (data) {
        let valid, message, result;
        if (userType === 'admin') {
            result = (0, validator_1.personDataValidator)(data);
        }
        else if (userType === 'manager') {
            result = (0, validator_1.managerDataValidator)(data);
        }
        else if (userType === 'student') {
            result = (0, validator_1.studentDataValidator)(data);
        }
        else {
            result = (0, validator_1.teacherDataValidator)(data);
        }
        valid = result.valid;
        message = result.message;
        if (!valid) {
            // ts-ignore
            res.status(400).send({ message });
            return;
        }
    }
    const { id } = req.params;
    if (checkId) {
        if (id !== req.body.userId) {
            res.status(401).send({ message: 'Unauthoirzed user for edit entity' });
        }
    }
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
    const model = (0, utils_1.userTypeUtil)(userType);
    const data = (0, utils_1.interfaceTypeUtil)(req.body, userType);
    if (data) {
        let valid, message, result;
        if (userType === 'admin') {
            result = (0, validator_1.personDataValidator)(data);
        }
        else if (userType === 'manager') {
            result = (0, validator_1.managerDataValidator)(data);
        }
        else if (userType === 'student') {
            result = (0, validator_1.studentDataValidator)(data);
        }
        else {
            result = (0, validator_1.teacherDataValidator)(data);
        }
        valid = result.valid;
        message = result.message;
        if (!valid) {
            // ts-ignore
            res.status(400).send({ message });
            return;
        }
    }
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
