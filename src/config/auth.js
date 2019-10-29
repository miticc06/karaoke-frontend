import { action, observable } from 'mobx'

class AuthStore {
  @observable isLogin = !!window.localStorage.getItem('token')

  @observable num = 123545

  @action
  setToken = token => {
    window.localStorage.setItem('token', token)
    this.isAuth = true
  }

  clearToken = () => {
    window.localStorage.clear()
    this.isAuth = false
  }
}

export default AuthStore
