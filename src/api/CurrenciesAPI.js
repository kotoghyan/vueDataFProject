import { Base } from 'src/api/Base'

export class CurrenciesAPI extends Base {
  static get entity() {
    return 'currencies'
  }

  static async getAll({ sort } = {}) {
    const params = {}
    if (sort !== undefined) {
      params.sort = { key: [sort.value], value: [sort.direction] }
    }

    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`, {
      params,
    })
    return data
  }
}
