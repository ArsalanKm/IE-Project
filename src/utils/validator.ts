import { IManager, IPerson, IStudent, ISubject, ITeacher } from 'models/_';

export interface IValidation {
  valid: boolean;
  message: string;
}

export const personDataValidator = (
  data: IPerson & { userId: string }
): IValidation => {
  const { name, familyName, phoneNumber, password, universityId, email } = data;

  if (
    !name ||
    !familyName ||
    !password ||
    !universityId ||
    !phoneNumber ||
    !email
  ) {
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

export const studentDataValidator = (
  data: IStudent & { userId: string }
): IValidation => {
  const { valid, message } = personDataValidator(
    data as IPerson & { userId: string }
  );
  if (!valid) {
    return {
      valid,
      message,
    };
  }
  const { educationDegree, enteranceYear, semester, average, faculty, field } =
    data;
  if (
    !educationDegree ||
    !enteranceYear ||
    !semester ||
    !average ||
    !faculty ||
    !field
  ) {
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

export const teacherDataValidator = (
  data: ITeacher & { userId: string }
): IValidation => {
  const { valid, message } = personDataValidator(
    data as IPerson & { userId: string }
  );
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

export const managerDataValidator = (
  data: IManager & { userId: string }
): IValidation => {
  const { valid, message } = personDataValidator(
    data as IPerson & { userId: string }
  );
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

export const subjectDataValidator = (
  data: ISubject & { userId: string }
): IValidation => {
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

export const loginValidator = (data: {
  universityId: string;
  password: string;
}): IValidation => {
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
