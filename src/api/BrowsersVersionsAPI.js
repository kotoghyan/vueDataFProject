import { Base } from 'src/api/Base'

export class BrowsersVersionsAPI extends Base {
  static get entity() {
    return 'browsers_versions'
  }

  static async getAll() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
