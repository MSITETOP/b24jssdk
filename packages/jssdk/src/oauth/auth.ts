import type { AuthActions, AuthData } from '../types/auth'

export interface B24OAuthParams {
  b24Url: string
  clientId: string
  accessToken: string
  refreshToken: string
  expiresIn: number
}

/**
 * OAuth Authorization Manager
 */
export class AuthOAuthManager implements AuthActions {
  #b24OAuthParams: B24OAuthParams
  #authData: AuthData | null = null
  
  constructor(b24OAuthParams: B24OAuthParams) {
    this.#b24OAuthParams = Object.freeze(Object.assign({}, b24OAuthParams))
    this.#initAuthData()
  }

  #initAuthData(): void {
    const domain = this.#b24OAuthParams.b24Url
      .replaceAll('https://', '')
      .replaceAll('http://', '')
      .replace(/:(80|443)$/, '')

    this.#authData = {
      access_token: this.#b24OAuthParams.accessToken,
      refresh_token: this.#b24OAuthParams.refreshToken,
      expires_in: this.#b24OAuthParams.expiresIn,
      domain: domain,
      member_id: domain,
    }
  }

  getAuthData(): false | AuthData {
    return this.#authData || false
  }

  async refreshAuth(): Promise<AuthData> {
    // Здесь должна быть логика обновления ток��на через refresh_token
    // Для примера возвращаем текущие данные
    return this.getAuthData() as AuthData
  }

  getUniq(prefix: string): string {
    const authData = this.getAuthData()
    if (authData === false) {
      throw new Error('AuthData not init')
    }
    return [prefix, authData.member_id].join('_')
  }

  getTargetOrigin(): string {
    return `${this.#b24OAuthParams.b24Url}`
  }

  getTargetOriginWithPath(): string {
    return `${this.#b24OAuthParams.b24Url}/rest`
  }

  get isAdmin(): boolean {
    // В OAuth нужно проверять права пользователя
    // Для примера возвращаем false
    return false
  }
} 