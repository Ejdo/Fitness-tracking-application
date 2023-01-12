export interface RegisterData {
  email: string
  password: string
  passwordConfirmation: string
  username: string
  age: number
  height: number
}

export interface LoginCredentials {
  email: string
  password: string
  remember: boolean
}

export interface User {
  id: number
  admin: boolean
  email: string
  password?: string
  username: string
  age: number
  height: number
}
