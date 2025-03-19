import { Base } from 'src/api/Base'

export class DealTypesAPI extends Base {
  static get entity() {
    return 'deal-types'
  }

  static async getAll() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
