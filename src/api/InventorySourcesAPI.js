import { Base } from 'src/api/Base'

export class InventorySourcesAPI extends Base {
  static get entity() {
    return 'inventory-sources'
  }

  static async getAll() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
