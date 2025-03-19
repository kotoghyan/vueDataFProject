import { Base } from 'src/api/Base'

export class RegionsAPI extends Base {
  static get entity() {
    return 'regions'
  }

  static async getAll() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
