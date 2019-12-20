
import { Modal, Form, Input, Select } from 'antd'
import React, { useState, useEffect } from 'react'
import { client } from 'config/client'
import { parseError } from 'helpers'
import { Notify } from 'helpers/notify'
import { GET_ROLES, UPDATE_USER } from './query'

const modalAddUser = Form.create()(props => {
  const { form, hide, visible, refetch, user } = props
  const [state, setState] = useState({
    roles: []
  })

  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { newPassword, roleId, name, email } = formData
        await client
          .mutate({
            mutation: UPDATE_USER,
            variables: {
              userId: user._id,
              input: {
                newPassword,
                roleId,
                name,
                email
              }
            }
          })
          .then(async res => {
            if (res && res.data && res.data.updateUserByAdmin) {
              // eslint-disable-next-line
              const notify = new Notify('success', 'Cập nhật user thành công!', 2)
              await refetch()
              hide()
              form.resetFields()
            }
          })
          .catch(err => {
            // eslint-disable-next-line
            const notify = new Notify('error', parseError(err), 3)
          })
      }
    })
  }

  const getRoles = async () => {
    client
      .query({
        query: GET_ROLES,
        variables: {
          roleIds: []
        }
      })
      .then(res => {
        setState(prevState => ({
          ...prevState,
          roles: res.data.roles
        }))
      })
      .catch(err => new Notify('error', parseError(err), 10))
  }

  useEffect(() => {
    getRoles()
  }, [])

  return (
    <Modal
      title='Cập nhật user'
      headerIcon='edit'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
      width='600px'
    >
      <Form>
        <Form.Item label='Username'>
          {form.getFieldDecorator('username', {
            initialValue: user && user.username ? user.username : ''
          })(<Input disabled='true' />)}
        </Form.Item>

        <Form.Item label='New password'>
          {form.getFieldDecorator('newPassword', {
          })(<Input type='password' />)}
        </Form.Item>

        <Form.Item label='name'>
          {form.getFieldDecorator('name', {
            initialValue: user && user.name ? user.name : '',
            rules: [{ required: true, message: 'Hãy nhập họ tên' }]
          })(<Input type='name' />)}
        </Form.Item>

        <Form.Item label='email'>
          {form.getFieldDecorator('email', {
            initialValue: user && user.email ? user.email : '',
            rules: [
              { required: true, message: 'Hãy nhập email' },
              {
                // eslint-disable-next-line max-len
                pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/igm,
                message: 'Địa chỉ email không hợp lệ'
              }
            ]
          })(<Input type='email' />)}
        </Form.Item>


        <Form.Item label='Role'>
          {form.getFieldDecorator('roleId', {
            initialValue: user && user.role && user.role._id ? user.role._id : '',
            rules: [{ required: true, message: 'Hãy phân Role cho user' }]
          })(
            <Select placeholder='Please select role ...'>
              {state.roles.map(role => (
                <Select.Option key={role._id} value={role._id}>
                  {`${role.code} (${role.name})`}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default modalAddUser
