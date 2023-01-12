import type { AxiosError, AxiosRequestConfig } from 'axios'
import type { LoginCredentials, RegisterData, User } from 'src/contracts'
import { api } from 'src/boot/axios'

class AuthService {
  async sha256(source: string) {
    const sourceBytes = new TextEncoder().encode(source);
    const digest = await crypto.subtle.digest('SHA-256', sourceBytes);
    const resultBytes = [...new Uint8Array(digest)];
    return resultBytes.map(x => x.toString(16).padStart(2, '0')).join('');
  }

  async me (dontTriggerLogout = false): Promise<User | null> {
    return api.get(
      'auth/me',
      { dontTriggerLogout } as AxiosRequestConfig
    )
      .then((response) => response.data)
      .catch((error: AxiosError) => {
        if (error.response?.status === 401) {
          return null
        }

        return Promise.reject(error)
      })
  }

  async register (data: RegisterData): Promise<User> {
    const credentials = JSON.parse(JSON.stringify(data))
    credentials.password = await this.sha256(credentials.password)
    credentials.passwordConfirmation = await this.sha256(credentials.passwordConfirmation)
    const response = await api.post<User>('auth/register', credentials)
    return response.data
  }

  async login (data: LoginCredentials): Promise<string> {
    const credentials = JSON.parse(JSON.stringify(data))
    credentials.password = await this.sha256(credentials.password)
    const response = await api.post('auth/login', credentials)
    return response.data
  }

  async logout (): Promise<void> {
    await api.post('auth/logout')
  }
}

export default new AuthService()
