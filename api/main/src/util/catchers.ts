import { createResponse } from './helpers';
import { BasicError } from './types';

export function basicCatch(error: BasicError) {
  const { code, message } = error;
  return createResponse(code, { message });
}
