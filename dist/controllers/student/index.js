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
const register_request_1 = __importDefault(require("../../models/register-request"));
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
router.get('/terms', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('student', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
router.get('/term/:id', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('manager', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const term = yield term_1.default.findById(id).exec();
        if (term) {
            res.status(200).send({ data: term });
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
            res.status(200).send({ data: term === null || term === void 0 ? void 0 : term.preRegistrationCourses });
        }
        else {
            res.status(400).send({ data: 'term not found' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
// TODO check this
router.post('/term/:id/preregister/:courseId', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('student', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id, courseId } = req.params;
        console.log(req.body.userId);
        const term = yield term_1.default.findById(id)
            .populate('preRegistrationCourses')
            .exec();
        if (term) {
            const courses = term.preRegistrationCourses;
            if (!courses.find((el) => el.id === courseId)) {
                res.status(400).send({ message: 'course not found in term' });
                return;
            }
            const existedPreRequest = yield pre_register_request_1.default.findOne({
                student: req.body.userId,
            }).exec();
            if (existedPreRequest) {
                const existedCourse = yield subject_1.SemesterSubject.findByIdAndUpdate(courseId).exec();
                const existedPreRegisterStudents = existedCourse === null || existedCourse === void 0 ? void 0 : existedCourse.preRegisterStudents;
                if ((existedPreRegisterStudents === null || existedPreRegisterStudents === void 0 ? void 0 : existedPreRegisterStudents.length) === 0 ||
                    (existedPreRegisterStudents === null || existedPreRegisterStudents === void 0 ? void 0 : existedPreRegisterStudents.find((el) => el.toString() !== req.body.userId))) {
                    existedPreRegisterStudents === null || existedPreRegisterStudents === void 0 ? void 0 : existedPreRegisterStudents.push(req.body.userId);
                }
                yield subject_1.SemesterSubject.findByIdAndUpdate(courseId, {
                    preRegisterStudents: existedPreRegisterStudents,
                    $inc: { capacity: 1 },
                }).exec();
                const request = existedPreRequest;
                (_a = existedPreRequest === null || existedPreRequest === void 0 ? void 0 : existedPreRequest.courses) === null || _a === void 0 ? void 0 : _a.push(courseId);
                yield pre_register_request_1.default.findByIdAndUpdate(request.id, {
                    courses: existedPreRequest.courses,
                }).exec();
                res.status(200).send({
                    message: 'course added to existed pre-registration request',
                });
            }
            else {
                yield subject_1.SemesterSubject.findByIdAndUpdate(courseId, {
                    $push: { preRegisterStudents: req.body.userId },
                    $inc: { capacity: 1 },
                    // registerStudents: existedRegisterStudents,
                }).exec();
                yield new pre_register_request_1.default({
                    term: id,
                    student: req.body.userId,
                    courses: [courseId],
                }).save();
                res
                    .status(200)
                    .send({ message: 'new pre-registration created with new course' });
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
// TODO check this
router.delete('/term/:id/preregister/:courseId', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('student', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { id, courseId } = req.params;
        const term = yield term_1.default.findById(id)
            .populate('preRegistrationCourses')
            .exec();
        if (term) {
            const courses = term.preRegistrationCourses;
            if (!courses.find((el) => el.id === courseId)) {
                res.status(400).send({ message: 'course not found in term' });
                return;
            }
            // console.log(req.body.userId);
            const existedPreRequest = yield pre_register_request_1.default.findOne({
                term: id,
                student: req.body.userId,
            })
                .populate('courses')
                .exec();
            if (existedPreRequest) {
                const request = existedPreRequest;
                yield pre_register_request_1.default.findByIdAndUpdate(request.id, {
                    courses: (_b = request.courses) === null || _b === void 0 ? void 0 : _b.filter((el) => el.id !== courseId),
                }).exec();
                yield subject_1.SemesterSubject.findByIdAndUpdate(courseId, {
                    $pull: { preRegisterStudents: req.body.userId },
                    $inc: { capacity: -1 },
                }).exec();
                res.status(200).send({
                    message: 'course deleted from pre-registration request',
                });
            }
            else {
                res.status(400).send({ message: 'pre-register not found' });
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
router.get('/term/:id/preregistrations', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('student', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const requests = yield pre_register_request_1.default.find({
            // term: id,
            student: req.body.userId,
        })
            .populate(['courses'])
            .exec();
        if (requests) {
            res.status(200).send({ data: requests });
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
            res.status(200).send({ data: term === null || term === void 0 ? void 0 : term.termCourses });
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
router.post('/term/:id/register/:courseId', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('student', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { id, courseId } = req.params;
        const term = yield term_1.default.findById(id).populate('termCourses').exec();
        if (term) {
            const courses = term.termCourses;
            if (!courses.find((el) => el.id === courseId)) {
                res.status(400).send({ message: 'course not found in term' });
                return;
            }
            const existedPreRequest = yield register_request_1.default.findOne({
                term: id,
                student: req.body.userId,
            }).exec();
            if (existedPreRequest) {
                const existedCourse = yield subject_1.SemesterSubject.findByIdAndUpdate(courseId).exec();
                const existedRegisterStudents = existedCourse === null || existedCourse === void 0 ? void 0 : existedCourse.registerStudents;
                if ((existedRegisterStudents === null || existedRegisterStudents === void 0 ? void 0 : existedRegisterStudents.length) === 0 ||
                    (existedRegisterStudents === null || existedRegisterStudents === void 0 ? void 0 : existedRegisterStudents.find((el) => el.toString() !== req.body.userId))) {
                    existedRegisterStudents === null || existedRegisterStudents === void 0 ? void 0 : existedRegisterStudents.push(req.body.userId);
                }
                yield subject_1.SemesterSubject.findByIdAndUpdate(courseId, {
                    registerStudents: existedRegisterStudents,
                    $inc: { capacity: 1 },
                }).exec();
                const request = existedPreRequest;
                (_c = existedPreRequest === null || existedPreRequest === void 0 ? void 0 : existedPreRequest.courses) === null || _c === void 0 ? void 0 : _c.push(courseId);
                console.log(existedPreRequest);
                yield register_request_1.default.findByIdAndUpdate(request.id, {
                    courses: existedPreRequest.courses,
                }).exec();
                res.status(200).send({
                    message: 'course added to existed registration request',
                });
                console.log('here');
            }
            else {
                yield subject_1.SemesterSubject.findByIdAndUpdate(courseId, {
                    $push: { registerStudents: req.body.userId },
                    $inc: { capacity: 1 },
                    // registerStudents: existedRegisterStudents,
                }).exec();
                yield new register_request_1.default({
                    term: id,
                    student: req.body.userId,
                    courses: [courseId],
                }).save();
                res
                    .status(200)
                    .send({ message: 'new registration created with new course' });
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
router.get('/term/:id/registrations', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('student', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const requests = yield register_request_1.default.find({
            term: id,
            student: req.body.userId,
        })
            .populate(['courses'])
            .exec();
        if (requests) {
            res.status(200).send({ data: requests });
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
router.delete('/term/:id/register/:courseId', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('student', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const { id, courseId } = req.params;
        const term = yield term_1.default.findById(id).populate('termCourses').exec();
        if (term) {
            const courses = term.termCourses;
            if (!courses.find((el) => el.id === courseId)) {
                res.status(400).send({ message: 'course not found in term' });
            }
            // console.log(req.body.userId);
            const existedPreRequest = yield register_request_1.default.findOne({
                student: req.body.userId,
            })
                .populate('courses')
                .exec();
            if (existedPreRequest) {
                const request = existedPreRequest;
                yield register_request_1.default.findByIdAndUpdate(request.id, {
                    courses: (_d = request.courses) === null || _d === void 0 ? void 0 : _d.filter((el) => el.id !== courseId),
                }).exec();
                yield subject_1.SemesterSubject.findByIdAndUpdate(courseId, {
                    $pull: { registerStudents: req.body.userId },
                }).exec();
                res.status(200).send({
                    message: 'course deleted registration request',
                });
            }
            else {
                res.status(400).send({ message: 'register not found' });
                return;
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
router.get('/term_courses', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('student', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield student_1.default.findById(req.body.userId)
            .populate(['termCourses'])
            .exec();
        if (requests) {
            res.status(200).send({ data: requests.termCourses });
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
