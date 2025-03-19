import { Base } from 'src/api/Base'

export class DeviceMakesAPI extends Base {
  static get entity() {
    return 'device_makes'
  }

  static async getAll() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
