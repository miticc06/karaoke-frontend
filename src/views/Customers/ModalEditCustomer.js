/* eslint-disable no-useless-escape */
import { Modal, Form, Input, Select } from 'antd'
import React, { useState, useEffect } from 'react'
import { client } from 'config/client'
import { parseError } from 'helpers'
import { Notify } from 'helpers/notify'
import { UPDATE_CUSTOMER } from './query'

const modalAddCustomer = Form.create()(props => {
  const { form, hide, visible, refetch, customer } = props
  const [state, setState] = useState({})

  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { name, email, phone } = formData
        await client
          .mutate({
            mutation: UPDATE_CUSTOMER,
            variables: {
              id: customer._id,
              input: {
                name,
                email,
                phone
              }
            }
          })
          .then(async res => {
            if (res && res.data && res.data.updateCustomer) {
              // eslint-disable-next-line
              const notify = new Notify(
                'success',
                'Cập nhật khách hàng thành công!',
                2
              )
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

  useEffect(() => {}, [])

  return (
    <Modal
      title='Cập nhật khách hàng'
      headerIcon='edit'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
      width='600px'
    >
      <Form>
        <Form.Item label='name'>
          {form.getFieldDecorator('name', {
            initialValue: customer && customer.name ? customer.name : '',
            rules: [{ required: true, message: 'Hãy nhập họ tên' }]
          })(<Input type='name' />)}
        </Form.Item>

        <Form.Item label='Phone'>
          {form.getFieldDecorator('phone', {
            initialValue: customer && customer.phone ? customer.phone : '',
            rules: [
              { required: true, message: 'Hãy nhập số điện thoại' },
              {
                // eslint-disable-next-line max-len
                pattern: /^[0-9]{10,}$/gi,
                message: 'Số điện thoại không hợp lệ'
              }
            ]
          })(<Input type='text' />)}
        </Form.Item>

        <Form.Item label='email'>
          {form.getFieldDecorator('email', {
            initialValue: customer && customer.email ? customer.email : '',
            rules: [
              { required: false, message: 'Hãy nhập email' },
              {
                // eslint-disable-next-line max-len
                pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gim,
                message: 'Địa chỉ email không hợp lệ'
              }
            ]
          })(<Input type='email' />)}
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default modalAddCustomer
