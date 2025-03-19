import { Base } from 'src/api/Base'

export class CreativeAddonsAPI extends Base {
  static get entity() {
    return 'creative_addons'
  }

  static async getAll() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
