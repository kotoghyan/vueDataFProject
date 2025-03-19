import { Base } from 'src/api/Base'

export class VendorFeesAPI extends Base {
  static get entity() {
    return 'vendor_fees'
  }

  static async getAll() {
    const data = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}`)
    return data
  }
}
