import { Base } from 'src/api/Base'

export class ApiFrameworksAPI extends Base {
  static get entity() {
    return 'api_frameworks'
  }

  static async getAll() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
