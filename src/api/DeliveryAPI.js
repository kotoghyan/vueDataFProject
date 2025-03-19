import { Base } from 'src/api/Base'

export class DeliveryAPI extends Base {
  static get entity() {
    return 'delivery'
  }

  static async createModifier({ name, advertiser_id, type, notes, delivery_model_id }) {
    const body = {
      name,
      type,
      notes,
      advertiser_id,
      delivery_model_id,
    }
    const { data } = await this.request().post(`/${this.entity}/modifiers`, body)
    return data
  }

  static async updateModifier({ id, name, advertiser_id, type, notes, delivery_model_id }) {
    const body = {
      name,
      type,
      notes,
      advertiser_id,
      delivery_model_id,
    }
    const { data } = await this.request().put(`/${this.entity}/modifiers/${id}`, body)
    return data
  }

  static async deleteModifier({ id }) {
    const data = await this.request().delete(`/${this.entity}/modifiers/${id}`)
    return data
  }

  static async getModifiers({ per_page, page } = {}, { customCancelEvent }) {
    const params = { per_page, page }
    const data = await this.request({ customCancelEvent, shouldCancelOnRoute: true }).get(
      `/${this.entity}/modifiers`,
      {
        params,
      }
    )
    return data
  }

  static async getModifier({ id }) {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(
      `/${this.entity}/modifiers/${id}`
    )
    return data
  }
}
