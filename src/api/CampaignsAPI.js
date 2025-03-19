import { Base } from 'src/api/Base'

export class CampaignsAPI extends Base {
  static get entity() {
    return 'campaigns'
  }

  static async create({ name, advertiser_id, type, active, notes }) {
    const body = {
      advertiser_id,
      type,
      name,
      active,
      notes,
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

  static async update({ id, name, advertiser_id, type, active, notes }) {
    const body = {
      id,
      advertiser_id,
      name,
      active,
      type,
      notes,
    }
    const { data } = await this.request().put(`/${this.entity}/${id}`, body)
    return data
  }

  static async getAll(
    {
      search,
      sort,
      per_page,
      page,
      advertiser_ids,
      active,
      associated_line_items,
      edited_today,
      ending_within_seven_days,
      favorites_only,
    } = {},
    { customCancelEvent } = {}
  ) {
    const params = {
      search,
      sort,
      active,
      associated_line_items,
      edited_today,
      ending_within_seven_days,
      favorites_only,
      per_page,
      page,
      advertiser_ids,
    }
    const data = await this.request({ customCancelEvent, shouldCancelOnRoute: true }).get(
      `/${this.entity}`,
      { params }
    )
    return data
  }

  static async get({ id }) {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}/${id}`)
    return data
  }

  static async getNames({ advertiser_ids } = {}, { customCancelEvent } = {}) {
    const params = { advertiser_ids }
    const { data } = await this.request({ shouldCancelOnRoute: true, customCancelEvent }).get(
      `/campaign_names`,
      {
        params,
      }
    )
    return data
  }
}
