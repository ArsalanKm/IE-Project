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
const professor_1 = __importDefault(require("./professor"));
const student_1 = __importDefault(require("./student"));
const manager_1 = __importDefault(require("./manager"));
const router = express_1.default.Router();
// TO DO admin authorization
router.use(professor_1.default);
router.use(student_1.default);
router.use(manager_1.default);
router.post('/create-admin', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return (0, utils_1.createUtil)('admin', req, res); }));
router.post('/login', (req, res) => (0, utils_1.loginHandler)('admin', req, res));
exports.default = router;
