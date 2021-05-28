import { createResponse } from 'util/helpers';

export interface Redirect {
  code?: number;
  location: string;
}

export default function redirect(redirect: Redirect) {
  const { code = 302, location } = redirect;

  const response = {
    statusCode: code,
    headers: {
      Location: location,
    },
    body: '',
  };

  return response;
}
