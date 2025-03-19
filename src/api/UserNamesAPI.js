import { Base } from 'src/api/Base'

export class UserNamesAPI extends Base {
  static get entity() {
    return 'user_names'
  }

  static async get() {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
