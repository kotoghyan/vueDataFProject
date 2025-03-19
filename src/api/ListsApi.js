import { Base } from 'src/api/Base'

export class ListsAPI extends Base {
  static get entity() {
    return 'lists'
  }

  static async delete({ id }) {
    const data = await this.request().delete(`/${this.entity}/${id}`)
    return data
  }

  static async deleteListItem({ list_id, id }) {
    const data = await this.request().delete(`/${this.entity}/${list_id}/items/${id}`)
    return data
  }

  static async create({ type, name, active }) {
    const body = {
      type,
      name,
      active,
    }
    const { data } = await this.request().post(`/${this.entity}`, body)
    return data
  }

  static async update({ type, name, active, id }) {
    const body = {
      name,
      type,
      active,
      id,
    }
    const { data } = await this.request().put(`/${this.entity}/${id}`, body)
    return data
  }

  static async createListItem({ id, name, attributes }) {
    const body = {
      name,
      attributes,
    }
    const { data } = await this.request().post(`/${this.entity}/${id}/items`, body)
    return data
  }

  static async editListItem({ list_id, name, attributes, id }) {
    const body = {
      name,
      attributes,
      id,
    }
    const { data } = await this.request().put(`/${this.entity}/${list_id}/items/${id}`, body)
    return data
  }

  static async getListItems({ id }) {
    const { data } = await this.request({ shouldCancelOnRoute: true }).get(
      `/${this.entity}/${id}/items`
    )
    return data
  }

  static async getAll({ per_page, page, types, search }, { customCancelEvent } = {}) {
    const params = { per_page, page, types, search }
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
