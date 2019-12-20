import React from 'react'
import { Provider } from 'mobx-react'
import { ApolloProvider } from 'react-apollo'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Chart } from 'react-chartjs-2'
import { ThemeProvider } from '@material-ui/styles'
import validate from 'validate.js'
import { client } from 'config/client'
import store from './config/store'

import { chartjs } from './helpers'
import theme from './theme'
import 'react-perfect-scrollbar/dist/css/styles.css'

import validators from './common/validators'
import Routes from './Routes'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-material.css'
// import 'theme-antd.less' // variables to override above
import 'antd/dist/antd.less'
import '@assets/less/index.less'
import '@assets/less/my-custom-antdesign-theme.less'

const browserHistory = createBrowserHistory()

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
})

validate.validators = {
  ...validate.validators,
  ...validators
}

function App () {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <Router history={browserHistory}>
            <Routes />
          </Router>
        </ThemeProvider>
      </ApolloProvider>
    </Provider>
  )
}

export default App
