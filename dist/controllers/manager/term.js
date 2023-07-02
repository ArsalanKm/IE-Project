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
const subject_1 = require("../../models/subject");
const register_request_1 = __importDefault(require("../../models/register-request"));
const pre_register_request_1 = __importDefault(require("../../models/pre-register-request"));
const router = express_1.default.Router();
router.get('/terms', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('manager', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
router.delete('/term/:id', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('manager', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
router.put('/term/:id', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('manager', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, termCourses, termUsersId, preRegistrationCourses } = req.body;
    try {
        const subject = yield term_1.default.findByIdAndUpdate(id, {
            name,
            termUsersId,
            termCourses,
            preRegistrationCourses,
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
router.post('/term', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('manager', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, termCourses, termUsersId, preRegistrationCourses } = req.body;
    try {
        const term = yield new term_1.default({
            name,
            termCourses,
            termUsersId,
            preRegistrationCourses,
        }).save();
        res.status(200).send({ message: 'created successfully', term });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.post('/term/:id/preregistration/:courseId', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('manager', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const termId = req.params.id;
    const courseId = req.params.courseId;
    try {
        let course = yield subject_1.SemesterSubject.findById(courseId).exec();
        const term = yield term_1.default.findById(termId).exec();
        const termPreRequests = term === null || term === void 0 ? void 0 : term.preRegistrationCourses;
        if (course) {
            termPreRequests === null || termPreRequests === void 0 ? void 0 : termPreRequests.push(course.id);
        }
        yield term_1.default.findByIdAndUpdate(termId, {
            preRegistrationCourses: termPreRequests,
        });
        res.status(200).send({ message: 'created successfully', term });
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
    const termId = req.params.id;
    try {
        const term = yield term_1.default.findById(termId)
            .populate({
            path: 'preRegistrationCourses',
            populate: {
                path: 'teacher',
                model: 'Teacher',
            },
        })
            .exec();
        console.log(term);
        const termPreRequests = term === null || term === void 0 ? void 0 : term.preRegistrationCourses;
        res.status(200).send({ data: termPreRequests });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.delete('/term/:id/preregistration/:courseId', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('manager', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const termId = req.params.id;
    const courseId = req.params.courseId;
    try {
        let course = yield subject_1.SemesterSubject.findById(courseId).exec();
        const term = yield term_1.default.findById(termId).exec();
        const termPreRegistrationCourses = term === null || term === void 0 ? void 0 : term.preRegistrationCourses;
        if (course) {
            let arrIndex;
            termPreRegistrationCourses === null || termPreRegistrationCourses === void 0 ? void 0 : termPreRegistrationCourses.forEach((el, index) => {
                if (el._id.toString() === (course === null || course === void 0 ? void 0 : course._id.toString())) {
                    arrIndex = index;
                }
            });
            console.log(arrIndex);
            if (arrIndex && arrIndex > -1) {
                termPreRegistrationCourses === null || termPreRegistrationCourses === void 0 ? void 0 : termPreRegistrationCourses.splice(arrIndex, 1);
                yield term_1.default.findByIdAndUpdate(termId, {
                    preRegistrationCourses: termPreRegistrationCourses,
                }).exec();
            }
        }
        res.status(200).send({
            message: 'deleted successfully',
            termPreRegistrationCourses: termPreRegistrationCourses,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.post('/term/:id/register/:courseId', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('manager', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const termId = req.params.id;
    const courseId = req.params.courseId;
    try {
        let course = yield subject_1.SemesterSubject.findById(courseId).exec();
        const term = yield term_1.default.findById(termId).exec();
        const termCourses = term === null || term === void 0 ? void 0 : term.termCourses;
        if (course) {
            termCourses === null || termCourses === void 0 ? void 0 : termCourses.push(course.id);
        }
        yield term_1.default.findByIdAndUpdate(termId, {
            termCourses,
        });
        res.status(200).send({ data: 'created successfully', term });
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
router.delete('/term/:id/register/:courseId', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('manager', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const termId = req.params.id;
    const courseId = req.params.courseId;
    try {
        let course = yield subject_1.SemesterSubject.findById(courseId).exec();
        const term = yield term_1.default.findById(termId).exec();
        const termCourses = term === null || term === void 0 ? void 0 : term.termCourses;
        if (course) {
            let arrIndex;
            termCourses === null || termCourses === void 0 ? void 0 : termCourses.forEach((el, index) => {
                if (el._id.toString() === (course === null || course === void 0 ? void 0 : course._id.toString())) {
                    arrIndex = index;
                }
            });
            console.log(arrIndex);
            if (arrIndex !== undefined && arrIndex > -1) {
                termCourses === null || termCourses === void 0 ? void 0 : termCourses.splice(arrIndex, 1);
                console.log(termCourses);
                yield term_1.default.findByIdAndUpdate(termId, {
                    termCourses,
                }).exec();
            }
        }
        res.status(200).send({
            message: 'deleted successfully',
            termPreRegistrationCourses: termCourses,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.put('/registration/:id', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('manager', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const update = yield register_request_1.default.findByIdAndUpdate(id, {
            confirm: true,
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
router.get('/term/:id/preregistrations', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('manager', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const requests = yield pre_register_request_1.default.find({ term: id })
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
router.get('/term/:id/registrations', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('manager', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const requests = yield register_request_1.default.find({ term: id })
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
exports.default = router;
