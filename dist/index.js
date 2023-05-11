"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const controllers_1 = require("./controllers");
const db_1 = __importDefault(require("./db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
db_1.default.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use('/admin', controllers_1.AdminRouter);
app.use('/manager', controllers_1.ManagerRouter);
app.use('/teacher', controllers_1.TeacherRouter);
app.use('/student', controllers_1.StudentRouter);
app.get('/', (req, res) => {
    res.send('Expresedsss + Typescript');
});
app.listen(port, () => {
    console.log('server is ruwafnnning');
});
