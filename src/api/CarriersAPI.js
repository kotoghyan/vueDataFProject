import { Base } from 'src/api/Base'

export class CarriersAPI extends Base {
  static get entity() {
    return 'carriers'
  }

  static async getAll() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
