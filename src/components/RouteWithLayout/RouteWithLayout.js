/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, ...rest } = props
  console.log(props)
  return (
    <Route
      {...rest}
      render={matchProps => (
        <Layout>
          <Component {...rest} {...matchProps} />
        </Layout>
      )}
    />
  )
}

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
}

export default RouteWithLayout
