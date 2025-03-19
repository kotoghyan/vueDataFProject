import { Base } from 'src/api/Base'

export class OperatingSystemVersionsAPI extends Base {
  static get entity() {
    return 'operating_system_versions'
  }

  static async getAll() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
