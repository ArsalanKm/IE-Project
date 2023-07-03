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
const authorization_1 = require("../../middlewares/authorization");
const subject_1 = require("../../models/subject");
const professor_1 = __importDefault(require("./professor"));
const student_1 = __importDefault(require("./student"));
const manager_1 = __importDefault(require("./manager"));
const faculty_1 = __importDefault(require("../../models/faculty"));
const term_1 = __importDefault(require("../../models/term"));
const router = express_1.default.Router();
// TO DO admin authorization
router.use(professor_1.default);
router.use(student_1.default);
router.use(manager_1.default);
router.post('/create-admin', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return (0, utils_1.createUtil)('admin', req, res); }));
router.post('/login', (req, res) => (0, utils_1.loginHandler)('admin', req, res));
router.get('/courses', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('admin', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield subject_1.Subject.find({}).populate('preRequests').exec();
        res.status(200).send({ courses });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.post('/faculty', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('admin', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, field } = req.body;
    if (!name || !field) {
        res.status(400).send({ message: 'name and field could not be empty' });
        return;
    }
    try {
        const existed = yield faculty_1.default.findOne({ name }).exec();
        if (existed) {
            res.status(400).send({ message: 'existed faculty' });
            return;
        }
        yield new faculty_1.default({
            name,
            field,
        }).save();
        res.status(200).send({ message: 'created successfully', success: true });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.get('/faculties', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('admin', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield faculty_1.default.find({}).exec();
        if (data) {
            res.status(200).send({ data });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.get('/terms', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('admin', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield term_1.default.find({}).exec();
        if (data) {
            res.status(200).send({ data });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
exports.default = router;
