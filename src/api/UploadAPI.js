import { Base } from 'src/api/Base'

export class UploadAPI extends Base {
  static get entity() {
    return 'upload'
  }

  static async uploadFile({ file }) {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await this.request().post(`/${this.entity}/file`, formData)
    return data
  }
}
