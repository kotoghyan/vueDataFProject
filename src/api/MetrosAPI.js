import { Base } from 'src/api/Base'

export class MetrosAPI extends Base {
  static get entity() {
    return 'metros'
  }

  static async getAll() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
