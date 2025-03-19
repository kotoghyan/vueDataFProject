import { Base } from 'src/api/Base'

export class TechnicalVendorsAPI extends Base {
  static get entity() {
    return 'technical_vendors'
  }

  static async getAll() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
