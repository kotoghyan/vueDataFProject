import { Base } from 'src/api/Base'

export class DeviceTypesAPI extends Base {
  static get entity() {
    return 'device-types'
  }

  static async getAll() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
