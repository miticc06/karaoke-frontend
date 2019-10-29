import React, { Component } from 'react'
import { Provider } from 'mobx-react'

import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Chart } from 'react-chartjs-2'
import { ThemeProvider } from '@material-ui/styles'
import validate from 'validate.js'
// import Root from './pages/index'
import store from './config/store'

import { chartjs } from './helpers'
import theme from './theme'
import 'react-perfect-scrollbar/dist/css/styles.css'
import './assets/scss/index.scss'
import validators from './common/validators'
import Routes from './Routes'

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
      <ThemeProvider theme={theme}>
        <Router history={browserHistory}>
          <Routes />
        </Router>
      </ThemeProvider>    
    </Provider>
  )
}

export default App
