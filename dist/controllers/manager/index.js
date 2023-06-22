"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("../utils");
const student_1 = __importDefault(require("./student"));
const student_2 = __importDefault(require("./student"));
const student_3 = __importDefault(require("./student"));
const term_1 = __importDefault(require("./term"));
const router = express_1.default.Router();
router.use(student_1.default);
router.use(student_2.default);
router.use(term_1.default);
router.use(student_3.default);
router.post('/login', (req, res) => (0, utils_1.loginHandler)('manager', req, res));
exports.default = router;
