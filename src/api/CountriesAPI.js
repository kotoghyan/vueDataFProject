import { Base } from 'src/api/Base'

export class CountriesAPI extends Base {
  static get entity() {
    return 'countries'
  }

  static async getAll() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
