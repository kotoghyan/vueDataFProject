import { Base } from 'src/api/Base'

export class DeviceModelsAPI extends Base {
  static get entity() {
    return 'device_models'
  }

  static async getAll() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
