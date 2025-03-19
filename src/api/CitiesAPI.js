import { Base } from 'src/api/Base'

export class CitiesAPI extends Base {
  static get entity() {
    return 'cities'
  }

  static async getAll({ search, ids } = {}, { customCancelEvent } = {}) {
    const params = { search, ids }
    const { data } = await this.request({ customCancelEvent, shouldCancelOnRoute: true }).get(
      `/${this.entity}`,
      { params }
    )
    return data
  }
}
