"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = __importDefault(require("../models/admin"));
const router = express_1.default.Router();
router.post('/create-admin', (req, res) => {
    const body = req.body;
    new admin_1.default({
        name: body.name,
        password: body.password,
        familyName: body.familyName,
        universityId: body.universityId,
        email: body.email,
        phoneNumber: body.phoneNumber,
    })
        .save()
        .then((data) => res.status(200).send({ data, message: 'admin created successfull=y' }))
        .catch((err) => {
        res.status(500).send({
            message: err.message || 'Some error occurred while creating the Tutorial.',
        });
    });
});
exports.default = router;
