import { AuthService, HttpService } from 'src/services'

export class Base {
  static get entity() {
    throw new Error('"entity" getter not defined')
  }

  static request(payload = {}) {
    const params = { version: 'v1', auth: true, ...payload }
    const httpInstance = new HttpService({
      baseURL: `${process.env.API_URL}/api/${params.version}`,
      ...params,
    })

    httpInstance.interceptors.response.use(({ data }) => data)

    if (params.auth) {
      httpInstance.interceptors.request.use(async (config) => {
        if (!AuthService.hasAccessToken) {
          try {
            await AuthService.handleAccessTokenRefresh()
          } catch (e) {}
        }

        if (AuthService.hasAccessToken) {
          config.headers.Authorization = `Bearer  ${AuthService.accessToken.token}`
        }

        return config
      })

      httpInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
          if (error?.response?.status === 401) {
            try {
              await AuthService.handleAccessTokenRefresh()
              return httpInstance({ ...error.config })
            } catch (e) {}
          }

          return Promise.reject(error)
        }
      )
    }

    return httpInstance
  }
}
