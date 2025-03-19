import { Base } from 'src/api/Base'

export class FirstPartyDealsAPI extends Base {
  static get entity() {
    return 'first_party_deals'
  }

  static async getAll(
    { advertiser_id, deal_format, search = 'deal' } = {},
    { customCancelEvent } = {}
  ) {
    const params = { advertiser_id, deal_format, search }
    const { data } = await this.request({ customCancelEvent, shouldCancelOnRoute: true }).get(
      `/${this.entity}`,
      {
        params,
      }
    )
    return data
  }

  static async create({
    deal_name,
    inventory_source,
    deal_id,
    advertiser_id,
    publisher,
    deal_type,
    deal_format,
    currency,
    start_date,
    end_date,
    archived,
  }) {
    const { data } = await this.request().post(`/${this.entity}`, {
      deal_name,
      inventory_source,
      deal_id,
      advertiser_id,
      publisher,
      deal_type,
      deal_format,
      currency,
      start_date,
      end_date,
      archived,
    })
    return data
  }
}
