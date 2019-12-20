import { Modal, Form, Input, Select } from 'antd'
import React from 'react'
import { client } from 'config/client'
import { parseError } from 'helpers'
import { Notify } from 'helpers/notify'
import { UPDATE_SERVICE } from './query'

const typeService = [
  { value: 'perHOUR', label: 'Theo giờ' },
  { value: 'perUNIT', label: 'Theo lượt' }
]

const ModalEditService = Form.create()(props => {
  const { form, hide, visible, refetch, service } = props

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
            mutation: UPDATE_SERVICE,
            variables: {
              serviceId: service._id,
              input: d
            }
          })
          .then(async res => {
            if (res && res.data && res.data.updateService) {
              // eslint-disable-next-line
              const notify = new Notify(
                'success',
                'Cập nhật thông tin dịch vụ phòng thành công!',
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
      title='Cập nhật thông tin dịch vụ phòng'
      headerIcon='edit'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
      width='600px'
    >
      <Form>
        <Form.Item label='Tên dịch vụ'>
          {form.getFieldDecorator('name', {
            initialValue: service ? service.name : '',
            rules: [{ required: true, message: 'Hãy nhập tên dịch vụ!' }]
          })(<Input type='name' />)}
        </Form.Item>

        <Form.Item label='Loại hình dịch vụ'>
          {form.getFieldDecorator('type', {
            initialValue: service ? service.type : '',
            rules: [{ required: true, message: 'Hãy chọn loại hình dịch vụ!' }]
          })(
            <Select placeholder='Nhấp để chọn...'>
              {typeService.map(type => (
                <Select.Option key={type.value} value={type.value}>
                  {`${type.label} `}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item label='Đơn giá '>
          {form.getFieldDecorator('unitPrice', {
            initialValue: service ? service.unitPrice : '',
            rules: [{ required: true, message: 'Hãy nhập đơn giá dịch vụ!' }]
          })(<Input type='number' />)}
        </Form.Item>

      </Form>
    </Modal>
  )
})

export default ModalEditService
