export class LocalStorageService {
  static get(key) {
    const value = localStorage.getItem(key)

    if (value !== null) {
      try {
        return JSON.parse(value)
      } catch (e) {}
    }

    return value
  }

  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  static remove(key) {
    localStorage.removeItem(key)
  }

  static has(key) {
    return this.get(key) !== null
  }
}
