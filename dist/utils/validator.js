"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.subjectDataValidator = exports.managerDataValidator = exports.teacherDataValidator = exports.studentDataValidator = exports.personDataValidator = void 0;
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
const studentDataValidator = (data) => {
    const { valid, message } = (0, exports.personDataValidator)(data);
    if (!valid) {
        return {
            valid,
            message,
        };
    }
    const { educationDegree, enteranceYear, semester, average, faculty, field } = data;
    if (!educationDegree ||
        !enteranceYear ||
        !semester ||
        !average ||
        !faculty ||
        !field) {
        return {
            valid: false,
            message: 'Fields should not be empty',
        };
    }
    if (!['Bachelor', 'Master', 'PhD'].includes(educationDegree)) {
        return {
            valid: false,
            message: 'education degree should be one of Bachelor, Master, PhD',
        };
    }
    if (isNaN(average)) {
        return {
            valid: false,
            message: 'average field should be an integer',
        };
    }
    return {
        valid: true,
        message: '',
    };
};
exports.studentDataValidator = studentDataValidator;
const teacherDataValidator = (data) => {
    const { valid, message } = (0, exports.personDataValidator)(data);
    if (!valid) {
        return {
            valid,
            message,
        };
    }
    const { faculty, field, rank } = data;
    if (!rank || !faculty || !field) {
        return {
            valid: false,
            message: 'Fields should not be empty',
        };
    }
    return {
        valid: true,
        message: '',
    };
};
exports.teacherDataValidator = teacherDataValidator;
const managerDataValidator = (data) => {
    const { valid, message } = (0, exports.personDataValidator)(data);
    if (!valid) {
        return {
            valid,
            message,
        };
    }
    const { faculty } = data;
    if (!faculty) {
        return {
            valid: false,
            message: 'Fields should not be empty',
        };
    }
    return {
        valid: true,
        message: '',
    };
};
exports.managerDataValidator = managerDataValidator;
const subjectDataValidator = (data) => {
    const { name, value } = data;
    if (!name || !value) {
        return {
            valid: false,
            message: 'field of subject are required',
        };
    }
    return {
        valid: true,
        message: '',
    };
};
exports.subjectDataValidator = subjectDataValidator;
const loginValidator = (data) => {
    const { universityId, password } = data;
    if (!universityId || !password) {
        return {
            message: 'fields should not be empty',
            valid: false,
        };
    }
    return {
        message: '',
        valid: true,
    };
};
exports.loginValidator = loginValidator;
