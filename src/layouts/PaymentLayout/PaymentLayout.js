import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import Skeleton from '@material-ui/lab/Skeleton'
import { Topbar, Footer } from './components'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64
    }
  },
  content: {
    height: '100%'
  }
}))

const PaymentLayout = props => {
  const { children } = props

  const classes = useStyles()
  if (!props.user) {
    return (
      <>
        <Skeleton height={15} width='90%' />
        <Skeleton height={15} width='80%' />
        <Skeleton height={15} width='60%' />
      </>
    )
  } else {
    return (
      <div
        className={clsx({
          [classes.root]: true
        })}
      >
        <Topbar />
        <main className={classes.content}>
          {children}
          <Footer />
        </main>
      </div>
    )
  }
}

PaymentLayout.propTypes = {
  children: PropTypes.node
}

export default PaymentLayout
