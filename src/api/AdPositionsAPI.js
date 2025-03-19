import { Base } from 'src/api/Base'

export class AdPositionsAPI extends Base {
  static get entity() {
    return 'ad_positions'
  }

  static async getAll() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
