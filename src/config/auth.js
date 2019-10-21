import { action, observable } from 'mobx'

class AuthStore {
  @observable isAuth = !!window.localStorage.getItem('access-token')

  @action
  authenticate = token => {
    window.localStorage.setItem('access-token', token)
    this.isAuth = true
  }

  logout = () => {
    window.localStorage.clear()
    this.isAuth = false
  }
}

export default AuthStore
