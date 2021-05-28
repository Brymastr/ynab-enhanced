import { createResponse } from 'util/helpers';

export interface ApiResponse {
  code?: number;
  body: { [key: string]: any };
}

export default function respond(response: ApiResponse) {
  const { code = 200, body } = response;
  return createResponse(code, body);
}
