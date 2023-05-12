"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const authMiddleware = (req, res, next) => {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer')) {
        const token = auth.slice(7);
        if (token) {
            const tokenData = (0, jwt_1.validateToken)(token);
            if (tokenData.valid) {
                req.body.userId = tokenData.id;
                next();
                return;
            }
            else {
                res.status(401).send({ message: 'UnAuthenticated' });
                return;
            }
        }
        else {
            res.status(401).send({ message: 'UnAuthenticated' });
            return;
        }
    }
    else {
        res.status(401).send({ message: 'UnAuthenticated' });
    }
};
exports.authMiddleware = authMiddleware;
