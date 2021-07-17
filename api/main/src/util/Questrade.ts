import OAuth2Client, { AuthClientConfig, ClientConfig } from './OAuth2Client';

export default class Questrade extends OAuth2Client {
  constructor(config: ClientConfig) {
    const authConfig: AuthClientConfig = Object.assign({}, config, {
      authUrl: 'https://login.questrade.com/oauth2/authorize',
      apiUrl: 'https://api01.iq.questrade.com',
    });
    super(authConfig);
  }
}
