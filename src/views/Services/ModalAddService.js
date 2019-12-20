import { Modal, Form, Input, Select } from 'antd'
import React from 'react'
import { client } from 'config/client'
import { parseError } from 'helpers'
import { Notify } from 'helpers/notify'
import { ADD_SERVICE } from './query'

const typeService = [
  { value: 'perHOUR', label: 'Theo giờ' },
  { value: 'perUNIT', label: 'Theo lượt' }
]
const modalAddService = Form.create()(props => {
  const { form, hide, visible, refetch } = props

  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { name, type, unitPrice } = formData
        const d = {
          name,
          type,
          unitPrice: parseFloat(unitPrice)
        }
        await client
          .mutate({
            mutation: ADD_SERVICE,
            variables: {
              input: d
            }
          })
          .then(async res => {
            if (res && res.data && res.data.createService) {
              // eslint-disable-next-line
              const notify = new Notify(
                'success',
                'Thêm dịch vụ phòng thành công!',
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

  return (
    <Modal
      title='Thêm dịch vụ phòng'
      headerIcon='plus'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
      width='600px'
    >
      <Form>
        <Form.Item label='Tên dịch vụ'>
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: 'Hãy nhập tên dịch vụ!' }]
          })(<Input type='name' />)}
        </Form.Item>

        <Form.Item label='Loại hình dịch vụ'>
          {form.getFieldDecorator('type', {
            rules: [{ required: true, message: 'Hãy chọn loại hình dịch vụ!' }]
          })(
            <Select placeholder='Nhấp vào để chọn...'>
              {typeService.map(type => (
                <Select.Option key={type.value} value={type.value}>
                  {`${type.label} `}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item label='Đơn giá'>
          {form.getFieldDecorator('unitPrice', {
            rules: [{ required: true, message: 'Hãy nhập đơn giá dịch vụ!' }]
          })(<Input type='number' />)}
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default modalAddService
