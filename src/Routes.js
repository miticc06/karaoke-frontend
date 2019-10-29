import React from 'react'
import { inject, observer } from 'mobx-react'

import { Switch, Redirect } from 'react-router-dom'

import { RouteWithLayout } from './components'
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts'

import {
  Dashboard as DashboardView,
  ProductList as ProductListView,
  UserList as UserListView,
  Typography as TypographyView,
  Icons as IconsView,
  Account as AccountView,
  Settings as SettingsView,
  Login as LoginView,
  NotFound as NotFoundView
} from './views'

const Routes = props => {
  const { 
    store: {
      authentication
    }
   } = props

  if (authentication.isLogin) {
    return (
      <Switch>
        <Redirect
          exact
          from='/'
          to='/dashboard'
        />
        <RouteWithLayout
          component={DashboardView}
          exact
          layout={MainLayout}
          path='/dashboard'
        />
        <RouteWithLayout
          component={UserListView}
          exact
          layout={MainLayout}
          path='/users'
        />
        <RouteWithLayout
          component={ProductListView}
          exact
          layout={MainLayout}
          path='/products'
        />
        <RouteWithLayout
          component={TypographyView}
          exact
          layout={MainLayout}
          path='/typography'
        />
        <RouteWithLayout
          component={IconsView}
          exact
          layout={MainLayout}
          path='/icons'
        />
        <RouteWithLayout
          component={AccountView}
          exact
          layout={MainLayout}
          path='/account'
        />
        <RouteWithLayout
          component={SettingsView}
          exact
          layout={MainLayout}
          path='/settings'
        />
        <RouteWithLayout
          component={SignUpView}
          exact
          layout={MinimalLayout}
          path='/sign-up'
        />
        <RouteWithLayout
          component={SignInView}
          exact
          layout={MinimalLayout}
          path='/sign-in'
        />
        <RouteWithLayout
          component={NotFoundView}
          exact
          layout={MinimalLayout}
          path='/not-found'
        />
        <Redirect to='/not-found' />
      </Switch>
      )  
    } else {
    return (
      <Switch>
        <Redirect
          exact
          from='/'
          to='/login'
        />
        <RouteWithLayout
          component={LoginView}
          exact
          layout={MinimalLayout}
          path='/login'
        />
        <Redirect to='/login' />
      </Switch>
      )
  }
}

// export default Routes
export default inject('store')(observer(Routes))