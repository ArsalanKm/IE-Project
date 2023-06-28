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
const utils_1 = require("../utils");
const subject_1 = require("../../models/subject");
const student_1 = __importDefault(require("../../models/student"));
const term_1 = __importDefault(require("../../models/term"));
const pre_register_request_1 = __importDefault(require("../../models/pre-register-request"));
const router = express_1.default.Router();
router.post('/login', (req, res) => (0, utils_1.loginHandler)('student', req, res));
router.get('/courses', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('student', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        if (userId) {
            const student = yield student_1.default.findById(userId).exec();
            const courses = yield subject_1.Subject.find({})
                .where({
                field: student === null || student === void 0 ? void 0 : student.field,
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
router.get('/all-courses', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('student', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { field } = req.query;
    try {
        const courses = field
            ? yield subject_1.Subject.find({ field }).populate('preRequests').exec()
            : yield subject_1.Subject.find({}).populate('preRequests').exec();
        res.status(200).send({ courses });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.get('/course/:id', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('student', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const course = yield subject_1.Subject.findById(id).exec();
        res.status(200).send({ course });
    }
    catch (error) {
        res.status(500).send({ message: 'server error' });
    }
}));
router.put('/:id', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('student', req, res, next), (req, res) => (0, utils_1.updateUtil)('student', req, res, true));
router.get('/terms', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('manager', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const terms = yield term_1.default.find({})
            .populate(['termCourses', 'preRegistrationCourses'])
            .exec();
        res.status(200).send({ terms });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.get('/term/:id/preregistration_courses', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('manager', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const term = yield term_1.default.findById(id)
            .populate('preRegistrationCourses')
            .exec();
        if (term) {
            res
                .status(200)
                .send({ preRegistrationCourses: term === null || term === void 0 ? void 0 : term.preRegistrationCourses });
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
router.get('/term/:id/registration_courses', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('manager', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const term = yield term_1.default.findById(id).populate('termCourses').exec();
        if (term) {
            res.status(200).send({ termCourses: term === null || term === void 0 ? void 0 : term.termCourses });
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
router.get('/term/:id/registration_courses', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('manager', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const term = yield term_1.default.findById(id).populate('termCourses').exec();
        if (term) {
            res.status(200).send({ termCourses: term === null || term === void 0 ? void 0 : term.termCourses });
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
// TODO check this
router.post('/term/:id/preregister/:courseId', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('manager', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, courseId } = req.params;
        const term = yield term_1.default.findById(id).populate('termCourses').exec();
        if (term) {
            const courses = term.preRegistrationCourses;
            if (!courses.find((el) => el.id === courseId)) {
                res.status(400).send({ message: 'course not found in term' });
            }
            const existedPreRequest = yield pre_register_request_1.default.find({
                student: req.body.userId,
            }).exec();
            if (existedPreRequest) {
                const request = existedPreRequest;
                yield pre_register_request_1.default.findByIdAndUpdate(request.id, {
                    student: req.body.userId,
                    courses: existedPreRequest.courses
                        .map((el) => el.id)
                        .push(courseId),
                }).exec();
            }
            else {
                yield new pre_register_request_1.default({
                    term: id,
                    student: req.body.userId,
                    courses: [courseId],
                }).save();
            }
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
exports.default = router;
