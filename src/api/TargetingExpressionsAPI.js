import { Base } from 'src/api/Base'

export class TargetingExpressionsAPI extends Base {
  static get entity() {
    return 'targeting_expressions'
  }

  static async get({ id }) {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(`/${this.entity}/${id}`)
    return data
  }

  static async create({ line_item_id, modules }) {
    const body = { line_item_id, modules }
    const data = await this.request().post(`/${this.entity}`, body)
    return data
  }

  static async update({ line_item_id, modules, targeting_expression_id }) {
    const body = { line_item_id, modules }
    const data = await this.request().put(`/${this.entity}/${targeting_expression_id}`, body)
    return data
  }
}
