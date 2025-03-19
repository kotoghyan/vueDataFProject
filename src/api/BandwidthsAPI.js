import { Base } from 'src/api/Base'

export class BandwidthsAPI extends Base {
  static get entity() {
    return 'bandwidths'
  }

  static async getAll() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
