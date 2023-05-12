import jwt from 'jsonwebtoken';

const jwtKey = 'secret';

export const generateAuthToken = (id: string): string => {
  const token = jwt.sign({ id }, jwtKey, { expiresIn: '100d' });
  return token;
};

export const validateToken = (
  token: string
): { valid: boolean; id: string } => {
  try {
    const tokenData = jwt.verify(token, jwtKey) as { id: string };
    if (tokenData) {
      return { id: tokenData.id, valid: true };
    } else {
      return { valid: false, id: '' };
    }
  } catch (error) {
    console.log('invalid token');
    return { valid: false, id: '' };
  }
};
