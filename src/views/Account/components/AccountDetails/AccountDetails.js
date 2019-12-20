
import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import validate from 'validate.js'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel
} from '@material-ui/core'
import { client } from 'config/client'
import { Notify } from 'helpers/notify'
import { parseError } from 'helpers'
import { MUTATE_UPDATE_USER } from './query'

const schema = {
  name: {
    presence: { allowEmpty: false, message: 'Vui lòng nhập họ tên đầy đủ.' },
    length: {
      maximum: 100
    }
  },
  email: {
    presence: { allowEmpty: false, message: 'Vui lòng nhập địa chỉ email.' },
    length: {
      maximum: 100
    },
    format: {
      // eslint-disable-next-line no-useless-escape
      pattern: '^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$',
      flags: 'gm',
      message: 'Vui lòng nhập email hợp lệ.'
    }
  },
  currentPassword: {
    presence: { allowEmpty: false, message: 'Vui lòng nhập mật khẩu hiện tại.' },
    length: {
      maximum: 128
    }
  },
  newPassword: {
    presence: { allowEmpty: false, message: 'Vui lòng nhập mật khẩu mới.' },
    length: {
      maximum: 128
    }
  },
  confirmNewPassword: {
    presence: { allowEmpty: false, message: 'Vui lòng xác nhận lại mật khẩu mới.' },
    length: {
      maximum: 128
    },
    equality: {
      attribute: 'newPassword',
      message: 'Mật khẩu xác nhận không trùng khớp.',
      comparator (v1, v2) {
        return v1 === v2
      }
    }
  }
}

const useStyles = makeStyles(() => ({
  root: {}
}))

const AccountDetails = props => {
  const { className, user, refetchcurrentuser } = props
  const classes = useStyles()

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      username: user.username,
      name: user.name,
      email: user.email,
      checkboxChangePassword: false,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    touched: {},
    errors: {}
  })

  useEffect(() => {
    let schemaCustom = schema
    if (!formState.values.checkboxChangePassword) {
      schemaCustom = {
        ...schema
      }
      delete schemaCustom.currentPassword
      delete schemaCustom.newPassword
      delete schemaCustom.confirmNewPassword
    }
    const errors = validate(formState.values, schemaCustom, { fullMessages: false })
    setFormState(fState => ({
      ...fState,
      isValid: !errors,
      errors: errors || {}
    }))
  }, [formState.values])


  const handleChange = event => {
    event.persist()

    setFormState(fState => ({
      ...fState,
      values: {
        ...fState.values,
        [event.target.name]: event.target.value
      },
      touched: {
        ...fState.touched,
        [event.target.name]: true
      }
    }))
  }

  const handleChangecheckboxChangePassword = event => {
    event.preventDefault()
    setFormState(fState => ({
      ...fState,
      values: {
        ...fState.values,
        checkboxChangePassword: !fState.values.checkboxChangePassword
      },
      touched: {
        ...fState.touched,
        checkboxChangePassword: true
      }
    }))
  }

  const handleUpdateProfile = async event => {
    event.preventDefault()
    const data = {
      ...formState.values
    }
    delete data.username
    delete data.roleId
    delete data.confirmNewPassword

    if (!data.checkboxChangePassword) {
      delete data.currentPassword
      delete data.newPassword
    }
    delete data.checkboxChangePassword

    await client.mutate({
      mutation: MUTATE_UPDATE_USER,
      variables: {
        userId: user._id,
        input: {
          ...data
        }
      }
    }).then(async res => {
      if (res.data.updateUser) {
        await refetchcurrentuser()
        return new Notify('success', 'Cập nhật profile thành công!')
      }
    }).catch(err => new Notify('error', parseError(err)))
  }

  const hasError = field => !!(formState.touched[field] && formState.errors[field])

  return (
    <Card className={clsx(classes.root, className)}>
      <form autoComplete='off' noValidate>
        <CardHeader
          subheader='Thông tin có thể chỉnh sửa'
          title='HỒ SƠ NGƯỜI DÙNG'
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                disabled
                fullWidth
                label='Tên tài khoản'
                margin='dense'
                name='username'
                value={formState.values.username}
                variant='outlined'
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                fullWidth
                error={hasError('name')}
                helperText={
                  hasError('name') ? formState.errors.name[0] : null
                }
                label='Họ và tên'
                margin='dense'
                name='name'
                onChange={handleChange}
                required
                value={formState.values.name}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                fullWidth
                error={hasError('email')}
                helperText={
                  hasError('email') ? formState.errors.email[0] : null
                }
                label='Email'
                margin='dense'
                name='email'
                onChange={handleChange}
                required
                value={formState.values.email}
                variant='outlined'
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <FormGroup row>
                <FormControlLabel
                  onClick={handleChangecheckboxChangePassword}
                  control={(
                    <Checkbox
                      checked={formState.values.checkboxChangePassword}
                      onChange={handleChangecheckboxChangePassword}
                      value
                      color='primary'
                    />
                  )}
                  label='Đổi mật khẩu'
                />
              </FormGroup>
            </Grid>
          </Grid>

          {formState.values.checkboxChangePassword && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  fullWidth
                  label='Mật khẩu hiện tại'
                  name='currentPassword'
                  error={hasError('currentPassword')}
                  helperText={
                    hasError('currentPassword') ? formState.errors.currentPassword[0] : null
                  }
                  margin='dense'
                  onChange={handleChange}
                  type='password'
                  value={formState.values.currentPassword || ''}
                  variant='outlined'
                  required
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  fullWidth
                  label='Mật khẩu mới'
                  name='newPassword'
                  error={hasError('newPassword')}
                  helperText={
                    hasError('newPassword') ? formState.errors.newPassword[0] : null
                  }
                  margin='dense'
                  onChange={handleChange}
                  type='password'
                  value={formState.values.newPassword || ''}
                  variant='outlined'
                  required
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  fullWidth
                  label='Nhập lại mật khẩu mới'
                  name='confirmNewPassword'
                  error={hasError('confirmNewPassword')}
                  helperText={
                    hasError('confirmNewPassword') ? formState.errors.confirmNewPassword[0] : null
                  }
                  margin='dense'
                  onChange={handleChange}
                  type='password'
                  value={formState.values.confirmNewPassword || ''}
                  variant='outlined'
                  required
                />
              </Grid>
            </Grid>
          )}

        </CardContent>
        <Divider />
        <CardActions>
          <Button
            disabled={!formState.isValid}
            onClick={handleUpdateProfile}
            color='primary'
            variant='contained'
          >
            Lưu thông tin
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}
export default AccountDetails
