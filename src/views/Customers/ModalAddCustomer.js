import { Modal, Form, Input } from 'antd'
import React, { useEffect } from 'react'
import { client } from 'config/client'
import { parseError } from 'helpers'
import { Notify } from 'helpers/notify'
import { ADD_CUSTOMER } from './query'

const modalAddUser = Form.create()(props => {
  const { form, hide, visible, refetch } = props


  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { name, email, phone } = formData
        await client
          .mutate({
            mutation: ADD_CUSTOMER,
            variables: {
              input: {
                name, email, phone
              }
            }
          })
          .then(async res => {
            if (res && res.data && res.data.createCustomer) {
              // eslint-disable-next-line
              const notify = new Notify('success', 'Thêm khách hàng thành công!', 2)
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

  useEffect(() => {
  }, [])


  return (
    <Modal
      title='Thêm khách hàng'
      headerIcon='plus'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
      width='600px'
    >
      <Form>

        <Form.Item label='Họ và tên khách hàng'>
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: 'Hãy nhập họ tên!' }]
          })(<Input type='name' />)}
        </Form.Item>

        <Form.Item label='Số điện thoại'>
          {form.getFieldDecorator('phone', {
            rules: [
              { required: true, message: 'Hãy nhập số điện thoại!' },
              {
                // eslint-disable-next-line max-len
                pattern: /^((09|03|07|08|05)+([0-9]{8})\b)$/g,
                message: 'Số điện thoại không hợp lệ!'
              }
            ]
          })(<Input type='text' />)}
        </Form.Item>

        <Form.Item label='Địa chỉ email'>
          {form.getFieldDecorator('email', {
            rules: [
              { required: false, message: 'Hãy nhập email' },
              {
                // eslint-disable-next-line max-len
                pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/igm,
                message: 'Địa chỉ email không hợp lệ!'
              }
            ]
          })(<Input type='email' />)}
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default modalAddUser
