import { Base } from 'src/api/Base'

export class LanguagesAPI extends Base {
  static get entity() {
    return 'languages'
  }

  static async getAll() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
