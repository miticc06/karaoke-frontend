/* eslint-disable linebreak-style */
import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import jwt from 'jsonwebtoken'
import { Switch, Redirect } from 'react-router-dom'
import { client } from 'config/client'
import gql from 'graphql-tag'
import { Notify } from 'helpers/notify'
import { parseError } from 'helpers'
import { RouteWithLayout } from './components'
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts'

import {
  Dashboard as DashboardView,
  ProductList as ProductListView,
  // UserList as UserListView,
  Users as UsersView,
  Typography as TypographyView,
  Icons as IconsView,
  Account as AccountView,
  Settings as SettingsView,
  Customers as CustomersView,
  Login as LoginView,
  PaymentSlips as PaymentSlipView,
  Discount as DiscountView
} from './views'

const PRIVATE_KEY = 'privateKey@12345678'

const GET_USER = gql`
  query($id: ID!) {
    user(id: $id) {
      _id
      username
      email
      name
      createdAt
      role {
        _id
        code
        name
        permissions {
          _id
          code
          name
        }
      }
      isActive
    }
  }
`
const Routes = props => {
  const [state, setState] = useState({
    user: null,
    permissions: new Set()
  })

  const {
    store: { authentication }
  } = props

  const getUser = async () => {
    try {
      if (!localStorage.getItem('token')) {
        return
      }
      let token = localStorage.getItem('token')
        ? jwt.verify(localStorage.getItem('token'), PRIVATE_KEY)
        : { userId: '' }
      let { userId } = token
      await client
        .query({
          query: GET_USER,
          variables: {
            id: userId
          }
        })
        .then(({ data }) => {
          const permissions = new Set()
          if (data && data.user && data.user.role) {
            data.user.role.permissions.forEach(per => permissions.add(per.code))
          } else {
            // eslint-disable-next-line
            const notify = new Notify('error', 'Có lỗi xảy ra!')
          }
          setState({
            user: data.user,
            permissions
          })
        })
        .catch(err => {
          console.dir(err)
          if (err && err.message && /^Network error:/.test(err.message)) {
            return new Notify('error', parseError(err), null)
          }
          return new Notify('error', parseError(err))
        })
    } catch (err) {
      if (err && err.name && err.name === 'JsonWebTokenError') {
        return new Notify('error', 'Token không hợp lệ', null)
      }
      return new Notify('error', parseError(err))
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  if (authentication.isLogin) {
    return (
      <Switch>
        <Redirect exact from='/' to='/dashboard' />
        <RouteWithLayout
          component={DashboardView}
          exact
          layout={MainLayout}
          path='/dashboard'
          refetchcurrentuser={getUser}
          {...state}
        />
        {/* <RouteWithLayout
          component={UserListView}
          exact
          layout={MainLayout}
          path='/users'
          refetchcurrentuser={getUser}
          {...state}
        /> */}

        <RouteWithLayout
          component={UsersView}
          exact
          layout={MainLayout}
          path='/users'
          refetchcurrentuser={getUser}
          {...state}
        />

        <RouteWithLayout
          component={CustomersView}
          exact
          layout={MainLayout}
          path='/customers'
          refetchcurrentuser={getUser}
          {...state}
        />

        <RouteWithLayout
          component={DiscountView}
          exact
          layout={MainLayout}
          path='/discounts'
          refetchcurrentuser={getUser}
          {...state}
        />

        <RouteWithLayout
          component={PaymentSlipView}
          exact
          layout={MainLayout}
          path='/paymentslips'
          refetchcurrentuser={getUser}
          {...state}
        />

        <RouteWithLayout
          component={ProductListView}
          exact
          layout={MainLayout}
          path='/products'
          refetchcurrentuser={getUser}
          {...state}
        />
        <RouteWithLayout
          component={TypographyView}
          exact
          layout={MainLayout}
          path='/typography'
          refetchcurrentuser={getUser}
          {...state}
        />
        <RouteWithLayout
          component={IconsView}
          exact
          layout={MainLayout}
          path='/icons'
          refetchcurrentuser={getUser}
          {...state}
        />
        <RouteWithLayout
          component={AccountView}
          exact
          layout={MainLayout}
          path='/account'
          refetchcurrentuser={getUser}
          {...state}
        />
        <RouteWithLayout
          component={SettingsView}
          exact
          layout={MainLayout}
          path='/settings'
          refetchcurrentuser={getUser}
          {...state}
        />
        <Redirect to='/dashboard' />
      </Switch>
    )
  } else {
    return (
      <Switch>
        <Redirect exact from='/' to='/login' />
        <RouteWithLayout
          component={LoginView}
          exact
          layout={MinimalLayout}
          path='/login'
          authentication={authentication}
          getUser={getUser}
        />
        <Redirect to='/login' />
      </Switch>
    )
  }
}

export default inject('store')(observer(Routes))
