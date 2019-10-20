import React from 'react'
import { Provider } from 'mobx-react'
import Root from './pages'
import store from './tools/mobx'

function App () {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  )
}

export default App
