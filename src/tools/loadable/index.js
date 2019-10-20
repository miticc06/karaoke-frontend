import React from 'react'
import Loadable from 'react-loadable'
import { Spin } from 'antd'

function Loading (props) {
  const { error, timedOut, pastDelay } = props
  if (error) {
    return <div>Error!</div>
  }
  if (timedOut) {
    return <div>Timeout</div>
  }
  if (pastDelay) {
    return (
      <div
        style={{
          textAlign: 'center',
          borderRadius: '4px',
          marginBottom: '20px',
          padding: '30px 50px',
          margin: '20px 0'
        }}
      >
        <Spin size='large' />
      </div>
    )
  }
  return null
}

const MyComponent = importComponent => Loadable({
    loader: () => importComponent,
    loading: Loading,
    delay: 500
  })

export default MyComponent
