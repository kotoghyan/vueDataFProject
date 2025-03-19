import { Base } from 'src/api/Base'

export class BrowsersAPI extends Base {
  static get entity() {
    return 'browsers'
  }

  static async getAll() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
