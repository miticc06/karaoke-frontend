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
        console.log(JSON.stringify(d))
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
                'Service updated successfully!',
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
      title='Update Service Information'
      headerIcon='edit'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
      width='600px'
    >
      <Form>
        <Form.Item label='Name:'>
          {form.getFieldDecorator('name', {
            initialValue: service ? service.name : '',
            rules: [{ required: true, message: 'Please Enter service Name' }]
          })(<Input type='name' />)}
        </Form.Item>

        <Form.Item label='Type:'>
          {form.getFieldDecorator('type', {
            initialValue: service ? service.type : '',
            rules: [{ required: true, message: 'Please choose a type' }]
          })(
            <Select placeholder='Press to choose ...'>
              {typeService.map(type => (
                <Select.Option key={type.value} value={type.value}>
                  {`${type.label} `}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item label='Price: '>
          {form.getFieldDecorator('unitPrice', {
            initialValue: service ? service.unitPrice : '',
            rules: [{ required: true, message: 'Please enter value' }]
          })(<Input type='number' />)}
        </Form.Item>

      </Form>
    </Modal>
  )
})

export default ModalEditService
