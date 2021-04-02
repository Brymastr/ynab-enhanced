export type LoginStatus = 'pending' | 'loggedIn' | 'loggedOut';

export interface UserState {
  sessionToken: string | null;
  sessionExpiration: number | null;
  loginStatus: LoginStatus;
}
