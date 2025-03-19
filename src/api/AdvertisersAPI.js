import { Base } from 'src/api/Base'

export class AdvertisersAPI extends Base {
  static get entity() {
    return 'advertisers'
  }

  static async create({
    default_image,
    name,
    domain,
    notes,
    active,
    default_currency,
    default_continent,
    category_id,
    default_click_url,
  }) {
    const body = {
      default_image,
      name,
      domain,
      notes,
      active,
      default_currency,
      default_continent,
      category_id,
      default_click_url,
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

  static async getAll(
    { sort, per_page, page, active, associated_campaigns, favorites_only, search } = {},
    { customCancelEvent } = {}
  ) {
    const params = { sort, per_page, page, active, associated_campaigns, favorites_only, search }
    const data = await this.request({ customCancelEvent, shouldCancelOnRoute: true }).get(
      `/${this.entity}`,
      { params }
    )
    return data
  }

  static async getNames({ user_ids } = {}, { customCancelEvent } = {}) {
    const params = { user_ids }
    const { data } = await this.request({ shouldCancelOnRoute: true, customCancelEvent }).get(
      `/advertiser_names`,
      {
        params,
      }
    )
    return data
  }

  static async get({ id }) {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}/${id}`)
    return data
  }

  static async update({
    id,
    default_image,
    name,
    domain,
    notes,
    active,
    default_currency,
    default_continent,
    category_id,
    default_click_url,
  }) {
    const body = {
      default_image,
      name,
      domain,
      notes,
      active,
      default_currency,
      default_continent,
      category_id,
      default_click_url,
    }
    const { data } = await this.request().put(`/${this.entity}/${id}`, body)
    return data
  }

  static async getCampaigns({ advertiser_id, per_page, page }, { customCancelEvent } = {}) {
    const params = {
      per_page,
      page,
    }
    const data = await this.request({ customCancelEvent, shouldCancelOnRoute: true }).get(
      `/${this.entity}/${advertiser_id}/campaigns`,
      {
        params,
      }
    )
    return data
  }

  static async getCampaignNames({ advertiser_id }, { customCancelEvent }) {
    const { data } = await this.request({ customCancelEvent, shouldCancelOnRoute: true }).get(
      `/${this.entity}/${advertiser_id}/campaign_names`
    )
    return data
  }

  static async getLineItems({ advertiser_id, search }, { customCancelEvent } = {}) {
    const params = { search }
    const data = await this.request({ customCancelEvent, shouldCancelOnRoute: true }).get(
      `/${this.entity}/${advertiser_id}/line_items`,
      { params }
    )
    return data
  }

  static async getCreatives({ advertiser_id, search }, { customCancelEvent } = {}) {
    const params = { search }
    const data = await this.request({ customCancelEvent, shouldCancelOnRoute: true }).get(
      `/${this.entity}/${advertiser_id}/creatives`,
      { params }
    )
    return data
  }
}
