import React from 'react'
import { inject, observer } from 'mobx-react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { routes } from '../routes'
import withLoadable from '../tools/loadable'
// import Layout from './layout'

function Root (props) {
  const { store } = props
  const { authStore } = store
  const { isAuth } = authStore
  return (
    <BrowserRouter>
      <Switch>
        {routes
          && routes.map(route => route.private ? (
              // Private
            <Route
              key={route.label}
              {...route}
              component={props1 => {
                  const MyComponent = withLoadable(
                    import(`./${route.component}`)
                  )
                  return isAuth ? (
                    <MyComponent {...props1} {...route} />
                  ) : (
                    <Redirect to='/login' />
                  )
                }}
            />
            ) : (
              // Not private
              <Route
                key={route.label}
                {...route}
                component={props1 => {
                  const MyComponent = withLoadable(
                    import(`./${route.component}`)
                  )
                  return !isAuth ? (
                    <MyComponent {...props1} {...route} />
                  ) : (
                    <Redirect to='/' />
                  )
                }}
              />
            ))}
      </Switch>
    </BrowserRouter>
  )
}
// export default Root
export default inject('store')(observer(Root))
