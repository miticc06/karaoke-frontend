import AuthStore from './auth'
  
class Store {
  constructor () {
    this.authStore = new AuthStore(this)
  }
}
export default new Store()
