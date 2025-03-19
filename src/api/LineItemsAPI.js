import { Base } from 'src/api/Base'

export class LineItemsAPI extends Base {
  static get entity() {
    return 'line_items'
  }

  static async create({ name, advertiser_id, campaign_id, type }) {
    const body = {
      name,
      advertiser_id,
      campaign_id,
      type,
    }
    const { data } = await this.request().post(`/${this.entity}`, body)
    return data
  }

  static async getAll(
    { per_page, page, campaign_ids, advertiser_ids, search } = {},
    { customCancelEvent }
  ) {
    const params = { per_page, page, campaign_ids, advertiser_ids, search }
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

  static async update({
    id,
    name,
    advertiser_id,
    campaign_id,
    start_date,
    end_date,
    budget_type,
    spend_budget_lifetime,
    spend_budget_daily,
    impressions_budget_lifetime,
    impressions_budget_daily,
    active,
    notes,
    flights,
    type,
    cpm_bid,
    frequency_caps_limits,
    tag_id,
  }) {
    const body = {
      advertiser_id,
      campaign_id,
      name,
      start_date,
      end_date,
      budget_type,
      spend_budget_lifetime,
      spend_budget_daily,
      impressions_budget_lifetime,
      impressions_budget_daily,
      active,
      notes,
      flights,
      type,
      cpm_bid,
      frequency_caps_limits,
      tag_id,
    }

    const { data } = await this.request().put(`/${this.entity}/${id}`, body)
    return data
  }

  static async start({ id }) {
    const data = await this.request().post(`/${this.entity}/${id}/start`)
    return data
  }

  static async stop({ id }) {
    const data = await this.request().post(`/${this.entity}/${id}/stop`)
    return data
  }

  static async switch({ id }) {
    const { data } = await this.request().post(`/${this.entity}/${id}/switch`)
    return data
  }

  static async getAds({ id }) {
    const data = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}/${id}/ads`)
    return data
  }

  static async delete({ id }) {
    const data = await this.request().delete(`/${this.entity}/${id}`)
    return data
  }

  static async createCreative({ line_item_id, creative_id }) {
    const body = {
      line_item_id,
      creative_id,
    }
    const data = await this.request().post(`/${this.entity}/${line_item_id}/creatives`, body)
    return data
  }

  static async getCreatives({ line_item_id, search, per_page, page }) {
    const params = { search, per_page, page }
    const data = await this.request({ shouldCancelOnRoute: true }).get(
      `${this.entity}/${line_item_id}/creatives`,
      { params }
    )
    return data
  }

  static async deleteCreative({ line_item_id, creative_id }) {
    const data = await this.request().delete(
      `/${this.entity}/${line_item_id}/creatives/${creative_id}`
    )
    return data
  }

  static async getNames({ advertiser_ids } = {}, { customCancelEvent } = {}) {
    const params = { advertiser_ids }
    const { data } = await this.request({ shouldCancelOnRoute: true, customCancelEvent }).get(
      `/line_item_names`,
      {
        params,
      }
    )
    return data
  }
}
