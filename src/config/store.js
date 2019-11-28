import Authentication from './auth'

class Store {
  constructor () {
    this.authentication = new Authentication(this)
  }
}
export default new Store()