"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordMiddleware = exports.PersonSchemaType = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_WORK_FACTOR = 10;
exports.PersonSchemaType = {
    name: { type: String, required: true },
    familyName: { type: String, required: true },
    password: { type: String, required: true },
    universityId: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
};
const passwordMiddleware = (schema) => {
    schema.pre('save', function (next) {
        let user = this;
        // only hash the password if it has been modified (or is new)
        if (!user.isModified('password'))
            return next();
        // generate a salt
        bcrypt_1.default.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            if (err)
                return next(err);
            // hash the password using our new salt
            bcrypt_1.default.hash(user.password, salt, function (err, hash) {
                if (err)
                    return next(err);
                // override the cleartext password with the hashed one
                user.password = hash;
                next();
            });
        });
    });
    schema.methods.comparePassword = function (candidatePassword, cb) {
        bcrypt_1.default.compare(candidatePassword, this.password, function (err, isMatch) {
            if (err) {
                return cb(err, false);
            }
            cb(null, isMatch);
        });
    };
    return schema;
};
exports.passwordMiddleware = passwordMiddleware;
