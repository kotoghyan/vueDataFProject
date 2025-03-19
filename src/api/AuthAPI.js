import { Base } from 'src/api/Base'

export class AuthAPI extends Base {
  static get entity() {
    return 'auth'
  }

  static async register({ email, password, firstName, lastName, phone }) {
    const body = { email, password, phone, first_name: firstName, last_name: lastName }
    const { data } = await this.request({ auth: false }).post(`/${this.entity}/register`, body)
    return data
  }

  static async login({ email, password }) {
    const body = { email, password }
    const { data } = await this.request({ auth: false }).post(`/${this.entity}/login`, body)
    return data
  }

  static async refreshToken({ refresh_token }) {
    const body = { refresh_token }
    const { data } = await this.request({ auth: false }).post(`/${this.entity}/refresh-token`, body)
    return data
  }

  static async getMe() {
    const { data } = await this.request().get(`/${this.entity}/me`)
    return data
  }
}
