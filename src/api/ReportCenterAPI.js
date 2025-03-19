import { Base } from 'src/api/Base'

export class ReportCenterAPI extends Base {
  static get entity() {
    return 'report-center'
  }

  static async getGeneral(
    { campaign_id, line_item_id, advertiser_id, type, date_from, date_to },
    { customCancelEvent } = {}
  ) {
    const params = { campaign_id, line_item_id, advertiser_id, type, date_from, date_to }
    const { data } = await this.request({ customCancelEvent }).get(`/${this.entity}/general`, {
      params,
    })
    return data
  }
}
