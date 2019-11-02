import { action, observable } from 'mobx'

class AuthStore {
  @observable isLogin = !!window.localStorage.getItem('token')

  @observable num = 123545

  @action
  setToken = token => {
    window.localStorage.setItem('token', token)
    this.isLogin = true
  }

  @action
  clearToken = () => {
    window.localStorage.clear()
    this.isLogin = false
  }
}

export default AuthStore
