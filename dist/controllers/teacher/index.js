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
const teacher_1 = __importDefault(require("../../models/teacher"));
const term_1 = __importDefault(require("../../models/term"));
const register_request_1 = __importDefault(require("../../models/register-request"));
const router = express_1.default.Router();
router.post('/login', (req, res) => (0, utils_1.loginHandler)('teacher', req, res));
router.get('/courses', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('teacher', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        if (userId) {
            const teacher = yield teacher_1.default.findById(userId).exec();
            const courses = yield subject_1.Subject.find({})
                .where({
                field: teacher === null || teacher === void 0 ? void 0 : teacher.field,
            })
                .populate('preRequests')
                .exec();
            res.status(200).send({ courses });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.get('/course/:id', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('teacher', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const course = yield subject_1.Subject.findById(id).exec();
        res.status(200).send({ course });
    }
    catch (error) {
        res.status(500).send({ message: 'server error' });
    }
}));
router.get('/all-courses', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('teacher', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { field } = req.query;
    try {
        const courses = field
            ? yield subject_1.Subject.find({})
                .where({
                field: field,
            })
                .populate('preRequests')
                .exec()
            : yield subject_1.Subject.find({}).populate('preRequests').exec();
        res.status(200).send({ courses });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.put('/:id', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('teacher', req, res, next), (req, res) => (0, utils_1.updateUtil)('teacher', req, res, true));
router.get('/terms', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('teacher', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const terms = yield term_1.default.find({})
            .populate(['termCourses', 'preRegistrationCourses'])
            .exec();
        res.status(200).send({ data: terms });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.get('/term/:id/registrations', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('teacher', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = yield register_request_1.default.find({ term: id })
            .populate(['courses', 'student'])
            .exec();
        if (data) {
            res.status(200).send({ data });
        }
        else {
            res.status(400).send({ message: 'term not found' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.get('/term/:id/course/:courseId/registrations', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('manager', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, courseId } = req.params;
        const data = yield register_request_1.default.find({}).exec();
        if (data) {
            res.status(200).send({ data });
        }
        else {
            res.status(400).send({ message: 'register for term not found' });
        }
        const term = yield term_1.default.findById(id).populate('termCourses').exec();
        const course = (term === null || term === void 0 ? void 0 : term.termCourses).find((el) => el.id === courseId);
        if (!course) {
            res.status(400).send({ message: 'coures not found in term courses' });
            return;
        }
        const response = data.filter((el) => el.courses.find((el) => el.id === courseId));
        res.status(200).send({ response });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.get('/term/:id', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('manager', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const course = yield term_1.default.findById(id)
            .populate(['termCourses', 'preRegistrationCourses'])
            .exec();
        res.status(200).send({ data: course });
    }
    catch (error) {
        res.status(500).send({ message: 'server error' });
    }
}));
router.put('/registration/:id', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('teacher', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const update = yield register_request_1.default.findByIdAndUpdate(id, {
            teacherConfirm: true,
        }).exec();
        if (update) {
            res.status(200).send({ message: 'updated successfully' });
        }
        else {
            res.status(400).send({ message: 'registration not found' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.get('/term/:id/registration_courses', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('teacher', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const termId = req.params.id;
    try {
        const term = yield term_1.default.findById(termId)
            .populate({
            path: 'termCourses',
            populate: {
                path: 'teacher',
                model: 'Teacher',
            },
        })
            .exec();
        const termCourses = term === null || term === void 0 ? void 0 : term.termCourses;
        res.status(200).send({ data: termCourses });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
exports.default = router;
