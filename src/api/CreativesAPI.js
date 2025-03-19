import { Base } from 'src/api/Base'

export class CreativesAPI extends Base {
  static get entity() {
    return 'creatives'
  }

  static async create({
    advertiser_id,
    name,
    click_url,
    type,
    pixels,
    scripts,
    media_id,
    active,
    creative_addons,
  }) {
    const body = {
      advertiser_id,
      name,
      click_url,
      type,
      pixels,
      scripts,
      media_id,
      active,
      creative_addons,
    }

    const { data } = await this.request().post(`/${this.entity}`, body)
    return data
  }

  static async update({
    id,
    advertiser_id,
    name,
    click_url,
    type,
    pixels,
    scripts,
    media_id,
    active,
    creative_addons,
    user_id,
  }) {
    const body = {
      id,
      advertiser_id,
      name,
      click_url,
      type,
      pixels,
      scripts,
      media_id,
      active,
      creative_addons,
      user_id,
    }

    const { data } = await this.request().put(`/${this.entity}/${id}`, body)
    return data
  }

  static async delete({ id }) {
    const data = await this.request().delete(`/${this.entity}/${id}`)
    return data
  }

  static async getAll(
    { search, per_page, page, advertiser_ids, line_item_ids } = {},
    { customCancelEvent } = {}
  ) {
    const params = { search, per_page, page, advertiser_ids, line_item_ids }
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
}
