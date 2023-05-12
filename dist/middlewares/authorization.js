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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationMiddleware = void 0;
const utils_1 = require("../utils");
const authorizationMiddleware = (userType, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('here');
    const { userId } = req.body;
    console.log(userId);
    const model = (0, utils_1.userTypeUtil)(userType);
    try {
        const result = yield (model === null || model === void 0 ? void 0 : model.findById(userId).exec());
        console.log(result);
        if (result) {
            next();
        }
        else {
            res.status(401).send({ message: 'UnAuthorized User for this endpoint' });
            return;
        }
    }
    catch (error) {
        res.status(500).send({ message: 'something went wrong', error });
    }
});
exports.authorizationMiddleware = authorizationMiddleware;
