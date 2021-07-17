import axios, { AxiosInstance } from 'axios';

export interface ClientConfig {
  clientId: string;
  clientSecret: string;
  authRedirectUri?: string;
}

export type AuthClientConfig = ClientConfig & {
  authUrl: string;
  apiUrl: string;
};

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export default class OAuth2Client {
  protected clientId: string;
  protected clientSecret: string;
  protected authRedirectUri: string;
  protected auth: AxiosInstance;
  protected api: AxiosInstance;
  private authUrl: string;

  constructor(config: AuthClientConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.authRedirectUri = config.authRedirectUri;
    this.authUrl = config.authUrl;

    this.auth = axios.create({ baseURL: config.authUrl });
    this.api = axios.create({ baseURL: config.apiUrl });
  }

  public buildAuthorizeUrl(state?: string): string {
    const urlParts = [
      `client_id=${this.clientId}`,
      `redirect_uri=${this.authRedirectUri}`,
      'response_type=code',
      'scope=read-only',
    ];
    if (state !== undefined) urlParts.push(`state=${state}`);

    const url = `${this.authUrl}/oauth/authorize?${urlParts.join('&')}`;
    return url;
  }

  protected buildAccessTokenUrl(code: string): string {
    const urlParts = [
      `client_id=${this.clientId}`,
      `client_secret=${this.clientSecret}`,
      `redirect_uri=${this.authRedirectUri}`,
      'grant_type=authorization_code',
      `code=${code}`,
    ];
    const url = `/oauth/token?${urlParts.join('&')}`;
    return url;
  }

  protected buildRefreshTokenUrl(token: string): string {
    const urlParts = [
      `client_id=${this.clientId}`,
      `client_secret=${this.clientSecret}`,
      'grant_type=refresh_token',
      `refresh_token=${token}`,
    ];
    const url = `/oauth/token?${urlParts.join('&')}`;
    return url;
  }
}
