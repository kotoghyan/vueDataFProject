import axios from 'axios'
import { BusService } from './BusService'

import { NotifyService } from 'src/services'

const CANCEL_ALL_KEY = 'AbortCurrentHTTPRequests'

export class HttpService {
  constructor({ shouldCancelOnRoute = false, customCancelEvent, baseURL } = {}) {
    this.shouldCancelOnRoute = shouldCancelOnRoute
    this.customCancelEvent = customCancelEvent
    this.controller = new AbortController()

    this.instance = axios.create({
      baseURL,
      signal: this.controller.signal,
    })
    this.addInterceptors()
    this.setupCancellationHandlers()

    return this.instance
  }

  setupCancellationHandlers() {
    const abortRequest = () => {
      this.controller.abort()
      BusService.off(CANCEL_ALL_KEY, abortRequest)
      if (this.customCancelEvent) {
        BusService.off(this.customCancelEvent, abortRequest)
      }
    }

    if (this.shouldCancelOnRoute) {
      BusService.on(CANCEL_ALL_KEY, abortRequest)
    }
    if (this.customCancelEvent) {
      BusService.on(this.customCancelEvent, abortRequest)
    }
  }

  addInterceptors() {
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const errors = error.response?.data?.errors?.errors ?? error.response?.data?.errors
        if (errors !== undefined) {
          const message = Object.values(errors).reduce((acc, err) => `${acc}<p>${err}</p>`, '')
          NotifyService.create({
            type: 'negative',
            message,
            html: true,
            group: error.request.responseURL,
          })
        }

        return Promise.reject(error)
      }
    )
  }
}
