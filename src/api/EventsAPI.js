import { Base } from 'src/api/Base'

export class EventsAPI extends Base {
  static get entity() {
    return 'events'
  }

  static async create({
    name,
    advertiser_id,
    event_type,
    default_value,
    click_window_days,
    view_window_days,
    notes,
    active,
  }) {
    const body = {
      name,
      advertiser_id,
      event_type,
      default_value,
      click_window_days,
      view_window_days,
      notes,
      active,
    }
    const { data } = await this.request().post(`/${this.entity}`, body)
    return data
  }

  static async delete({ id }) {
    const data = await this.request().delete(`/${this.entity}/${id}`)
    return data
  }

  static async bulkDelete({ ids }) {
    const body = { ids }
    const data = await this.request().post(`/${this.entity}/bulk_delete`, body)
    return data
  }

  static async getAll({ per_page, page, search } = {}, { customCancelEvent } = {}) {
    const params = { per_page, page, search }
    const data = await this.request({ customCancelEvent, shouldCancelOnRoute: true }).get(
      `/${this.entity}`,
      { params }
    )
    return data
  }
}
