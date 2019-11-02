import { action, observable, decorate } from 'mobx'

class AuthStore {
  isLogin = !!window.localStorage.getItem('token')

  setToken = token => {
    window.localStorage.setItem('token', token)
    this.isLogin = true
  }

  clearToken = () => {
    window.localStorage.clear()
    this.isLogin = false
  }
}

decorate(AuthStore, {
  isLogin: observable,
  setToken: action,
  clearToken: action
})

export default AuthStore
