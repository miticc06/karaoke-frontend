import React from 'react'
import { inject, observer } from 'mobx-react'
import LayoutApp from './layout'

function Root (props) {
  const { store } = props
  console.log(store)
  return <LayoutApp />
}
export default inject('store')(observer(Root))
