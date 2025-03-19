import moment from 'moment'
import $router from 'src/router'
import { LocalStorageService } from './index'
import { AuthAPI } from 'src/api'
import { waitUntil } from 'src/utils/index.js'

export class AuthService {
  static ACCESS_TOKEN_KEY = 'accessToken'
  static REFRESH_TOKEN_KEY = 'refreshToken'
  static IS_REFRESHING_KEY = 'tokenIsRefreshing'
  static REFRESH_TIMEOUT_SECONDS = 15

  static get isRefreshing() {
    const refreshStartTime = LocalStorageService.get(this.IS_REFRESHING_KEY)
    if (!refreshStartTime) {
      return false
    }

    const elapsedTime = moment().diff(moment(refreshStartTime), 'seconds')
    return elapsedTime <= this.REFRESH_TIMEOUT_SECONDS
  }

  static set isRefreshing(value) {
    if (value) {
      LocalStorageService.set(this.IS_REFRESHING_KEY, moment().toISOString())
    } else {
      LocalStorageService.remove(this.IS_REFRESHING_KEY)
    }
  }

  static get accessToken() {
    return LocalStorageService.get(this.ACCESS_TOKEN_KEY)
  }

  static set accessToken({ token, expires_in }) {
    LocalStorageService.set(this.ACCESS_TOKEN_KEY, {
      token,
      expires_in: moment().add(expires_in, 'seconds').unix(),
    })
  }

  static get hasAccessToken() {
    if (!LocalStorageService.has(this.ACCESS_TOKEN_KEY)) {
      return false
    }

    const { expires_in } = LocalStorageService.get(this.ACCESS_TOKEN_KEY)
    const isNotExpired = moment().unix() < expires_in
    return isNotExpired
  }

  static get refreshToken() {
    return LocalStorageService.get(this.REFRESH_TOKEN_KEY)
  }

  static set refreshToken(token) {
    LocalStorageService.set(this.REFRESH_TOKEN_KEY, token)
  }

  static get hasRefreshToken() {
    return LocalStorageService.has(this.REFRESH_TOKEN_KEY)
  }

  static setTokens({ access_token, expires_in, refresh_token }) {
    this.accessToken = { token: access_token, expires_in }
    this.refreshToken = refresh_token
  }

  static async refreshAccessToken() {
    const beforeUnloadHandler = () => {
      this.isRefreshing = false
    }
    window.addEventListener('beforeunload', beforeUnloadHandler)

    this.isRefreshing = true
    try {
      const data = await AuthAPI.refreshToken({
        refresh_token: this.refreshToken,
      })
      this.setTokens(data)
    } catch (e) {
      await this.logout()
    } finally {
      this.isRefreshing = false
      window.removeEventListener('beforeunload', beforeUnloadHandler)
    }
  }

  static waitForRefreshingEnd() {
    return waitUntil(() => !this.isRefreshing, 50)
  }

  static handleAccessTokenRefresh() {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.isRefreshing) {
          await this.waitForRefreshingEnd()
        } else if (!this.hasAccessToken) {
          if (this.hasRefreshToken) {
            await this.refreshAccessToken()
          } else {
            await this.logout()
            return reject()
          }
        }

        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }

  static async logout() {
    LocalStorageService.remove(this.ACCESS_TOKEN_KEY)
    LocalStorageService.remove(this.REFRESH_TOKEN_KEY)
    this.isRefreshing = false

    const router = $router()
    await router.replace({ name: 'login' })
    router.go()
  }
}
