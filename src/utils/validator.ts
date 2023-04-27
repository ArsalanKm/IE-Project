import { IPerson } from 'models/_';

export const personDataValidator = (
  data: IPerson
): { valid: boolean; message: string } => {
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
