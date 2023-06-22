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
const authorization_1 = require("../../middlewares/authorization");
const term_1 = __importDefault(require("../../models/term"));
const router = express_1.default.Router();
router.get('/terms', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('manager', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield term_1.default.find({}).populate('termCourses').exec();
        res.status(200).send({ courses });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.get('/term/:id', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('manager', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const course = yield term_1.default.findById(id).populate('termCourses').exec();
        res.status(200).send({ course });
    }
    catch (error) {
        res.status(500).send({ message: 'server error' });
    }
}));
router.delete('/term/:id', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('manager', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield term_1.default.findByIdAndDelete(id).exec();
        if (result) {
            res.status(200).send({ data: result, message: 'deleted successfully' });
        }
        else {
            res.status(400).send({ message: 'course does not exists' });
        }
    }
    catch (error) {
        res.status(500).send({ message: 'server error' });
    }
}));
router.put('/term/:id', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('manager', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, termCourses, termUsersId } = req.body;
    try {
        const subject = yield term_1.default.findByIdAndUpdate(id, {
            name,
            termUsersId,
            termCourses,
        }).exec();
        if (!subject) {
            res.status(400).send({ message: 'There is no course with that id' });
        }
        res.status(200).send({ message: 'updated successfully', subject });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.post('/term', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('manager', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, termCourses, termUsersId } = req.body;
    try {
        const term = yield new term_1.default({
            name,
            termCourses,
            termUsersId,
        }).save();
        res.status(200).send({ message: 'created successfully', term });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.post('/term/:id/preregistration', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('manager', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, termCourses, termUsersId } = req.body;
    try {
        const term = yield new term_1.default({
            name,
            termCourses,
            termUsersId,
        }).save();
        res.status(200).send({ message: 'created successfully', term });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
exports.default = router;
