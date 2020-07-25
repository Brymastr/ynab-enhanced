export type LoginStatus = 'pending' | 'loggedIn' | 'loggedOut';

export interface UserState {
  sessionId: string | null;
  loginStatus: LoginStatus;
}
