import React from 'react'
import { Provider } from 'mobx-react'

import store from './config/store'
import Root from './pages/index'

function App () {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  )
}

export default App
