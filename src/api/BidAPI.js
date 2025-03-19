import { Base } from 'src/api/Base'

export class BidAPI extends Base {
  static get entity() {
    return 'bid'
  }

  static async createModifier({ name, advertiser_id, notes, min_bid, max_bid, model }) {
    const body = {
      name,
      notes,
      model,
      advertiser_id,
      min_bid,
      max_bid,
    }
    const { data } = await this.request().post(`/${this.entity}/modifiers`, body)
    return data
  }

  static async getModifiers() {
    const data = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}/modifiers`)
    return data
  }
}
