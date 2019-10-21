import React from 'react'
import { Provider } from 'mobx-react'

import store from './config/store'

function App () {
  return (
    <Provider store={store}>
      <>asas</>
    </Provider>
  )
}

export default App
