"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.personDataValidator = void 0;
const personDataValidator = (data) => {
    const { name, familyName, phoneNumber, password, universityId, email } = data;
    if (!name ||
        !familyName ||
        !password ||
        !universityId ||
        !phoneNumber ||
        !email) {
        return {
            valid: false,
            message: 'Fields could not be empty',
        };
    }
    return {
        valid: true,
        message: '',
    };
};
exports.personDataValidator = personDataValidator;
