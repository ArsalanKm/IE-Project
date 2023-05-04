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
const bcrypt_1 = __importDefault(require("bcrypt"));
const admin_1 = __importDefault(require("../../models/admin"));
const professor_1 = __importDefault(require("./professor"));
const student_1 = __importDefault(require("./student"));
const router = express_1.default.Router();
// TO DO admin authorization
router.use(professor_1.default);
router.use(student_1.default);
router.post('/create-admin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password, familyName, universityId, email, phoneNumber } = req.body;
    try {
        const data = yield new admin_1.default({
            name,
            password,
            familyName,
            universityId,
            email,
            phoneNumber,
        }).save();
        if (data) {
            res.status(200).send({ data, message: 'admin created successfully' });
        }
    }
    catch (error) {
        res.status(500).send({
            message: 'Some error occurred while creating the admin.',
        });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const user = yield admin_1.default.findOne({
            universityId: body.universityId,
        }).exec();
        if (user) {
            console.log(body.password, user.password);
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
    }
    catch (error) {
        console.log(error);
        res.status(401).send({ message: 'There is no user with that name' });
    }
}));
exports.default = router;
