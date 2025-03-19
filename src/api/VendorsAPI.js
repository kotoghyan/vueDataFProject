import { Base } from 'src/api/Base'

export class VendorsAPI extends Base {
  static get entity() {
    return 'vendors'
  }

  static async getAll() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
