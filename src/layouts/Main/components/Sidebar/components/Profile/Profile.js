/* eslint-disable */
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Avatar, Typography } from '@material-ui/core'
import md5 from 'md5'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  }
}))

const Profile = props => {
  const { className, user } = props
  const classes = useStyles()

  return (
    <div className={clsx(classes.root, className)}>
      <Avatar
        alt='Person'
        className={classes.avatar}
        component={RouterLink}
        src={user && user.email ? `https://s.gravatar.com/avatar/${md5(user.email)}?s=256` : ''}
        to='/settings'
      />
      <Typography
        className={classes.name}
        variant='h4'
      >
        {user && user.name}
      </Typography>
      <Typography variant='body2'>{user && user.role && user.role.name}</Typography>
    </div>
  )
}

Profile.propTypes = {
  className: PropTypes.string
}

export default Profile
