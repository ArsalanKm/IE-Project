"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestValidatorMiddleware = void 0;
const validator_1 = require("../utils/validator");
const requestValidatorMiddleware = (model, req, res, next) => {
    let data;
    const body = req.body;
    if (!body) {
        res.status(400).send({ message: 'fields are required' });
        return;
    }
    switch (model) {
        case 'person':
            data = (0, validator_1.personDataValidator)(body);
            break;
        case 'teacher':
            data = (0, validator_1.teacherDataValidator)(body);
            break;
        case 'subject':
            data = (0, validator_1.subjectDataValidator)(body);
            break;
        case 'manager':
            data = (0, validator_1.managerDataValidator)(body);
            break;
    }
    if (data === null || data === void 0 ? void 0 : data.valid) {
        next();
    }
    else {
        res.status(400).send({ message: data.message, valid: data.valid });
    }
};
exports.requestValidatorMiddleware = requestValidatorMiddleware;
