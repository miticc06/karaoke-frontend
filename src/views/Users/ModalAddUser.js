/* eslint-disable no-useless-escape */
import { Modal, Form, Input, Select } from 'antd'
import React, { useState, useEffect } from 'react'
import { client } from 'config/client'
import { parseError } from 'helpers'
import { Notify } from 'helpers/notify'
import { ADD_USER, GET_ROLES } from './query'

const modalAddUser = Form.create()(props => {
  const { form, hide, visible, refetch } = props
  const [state, setState] = useState({
    roles: []
  })

  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { username, password, roleId, name, email } = formData
        await client
          .mutate({
            mutation: ADD_USER,
            variables: {
              input: {
                username,
                password,
                roleId,
                name,
                email
              }
            }
          })
          .then(async res => {
            if (res && res.data && res.data.createUser) {
              // eslint-disable-next-line
              const notify = new Notify('success', 'Thêm user thành công!', 2)
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

  console.log(state.roles)

  return (
    <Modal
      title='Thêm user'
      headerIcon='plus'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
      width='600px'
    >
      <Form>
        <Form.Item label='Username'>
          {form.getFieldDecorator('username', {
            rules: [
              { required: true, message: 'Hãy nhập Username' },
              {
                min: 3,
                message: 'Username phải chứa ít nhất 3 ký tự'
              },
              {
                pattern: /^[\w]{3,}$/gi,
                message: 'Username chỉ được chứa chữ, số và dấu _'
              }
            ]
          })(<Input />)}
        </Form.Item>

        <Form.Item label='password'>
          {form.getFieldDecorator('password', {
            rules: [{ required: true, message: 'Hãy nhập Password' }]
          })(<Input type='password' />)}
        </Form.Item>

        <Form.Item label='name'>
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: 'Hãy nhập họ tên' }]
          })(<Input type='name' />)}
        </Form.Item>

        <Form.Item label='email'>
          {form.getFieldDecorator('email', {
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
