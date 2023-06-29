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
const subject_1 = require("../../models/subject");
const jwt_1 = require("../../middlewares/jwt");
const authorization_1 = require("../../middlewares/authorization");
const router = express_1.default.Router();
// router.post(
//   '/course',
//   authMiddleware,
//   (req: Request, res: Response, next: NextFunction) =>
//     authorizationMiddleware('manager', req, res, next),
//   async (req: Request, res: Response) => {
//     const { name, value, preRequests, sameRequests, field } =
//       req.body as ISubject & {
//         id: string;
//       };
//     try {
//       const subject = await new Subject({
//         name,
//         value,
//         preRequests,
//         sameRequests,
//         field,
//       }).save();
//       res.status(200).send({ message: 'created successfully', subject });
//     } catch (error) {
//       console.log(error);
//       res.status(500).send({ message: error });
//     }
//   }
// );
router.post('/course', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('manager', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, value, preRequests, sameRequests, field, classTime, examTime, examLocation, teacher, capacity, semester, } = req.body;
    try {
        const subject = yield new subject_1.SemesterSubject({
            name,
            value,
            preRequests,
            sameRequests,
            field,
            classTime,
            examTime,
            examLocation,
            teacher,
            capacity,
            semester,
        }).save();
        res.status(200).send({ message: 'created successfully', subject });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.put('/course/:id', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('manager', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, value, preRequests, sameRequests, field } = req.body;
    try {
        const subject = yield subject_1.Subject.findByIdAndUpdate(id, {
            name,
            value,
            preRequests,
            sameRequests,
            field,
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
router.delete('/course/:id', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('manager', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield subject_1.Subject.findByIdAndDelete(id).exec();
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
router.get('/courses', 
// authMiddleware,
// (req: Request, res: Response, next: NextFunction) =>
//   authorizationMiddleware('manager', req, res, next),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield subject_1.Subject.find({}).populate('preRequests').exec();
        res.status(200).send({ courses });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}));
router.get('/course/:id', jwt_1.authMiddleware, (req, res, next) => (0, authorization_1.authorizationMiddleware)('manager', req, res, next), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const course = yield subject_1.Subject.findById(id).exec();
        res.status(200).send({ course });
    }
    catch (error) {
        res.status(500).send({ message: 'server error' });
    }
}));
exports.default = router;
