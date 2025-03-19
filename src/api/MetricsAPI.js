import { Base } from 'src/api/Base'

export class MetricsAPI extends Base {
  static get entity() {
    return 'metrics'
  }

  static async get({ level, types, periods }) {
    const params = { level, types, periods }
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`, {
      params,
    })
    return data
  }
}
