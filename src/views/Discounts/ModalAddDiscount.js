import { Modal, Form, Input, Select, DatePicker } from 'antd'
import React from 'react'
import moment from 'moment'
import { client } from 'config/client'
import { parseError } from 'helpers'
import { Notify } from 'helpers/notify'
import { ADD_DISCOUNT } from './query'

const { RangePicker } = DatePicker

const typeCoupon = [
  { value: 'DEDUCT', label: 'Khấu trừ' },
  { value: 'PERCENT', label: 'Phần trăm' }
]

const ModalAddDiscount = Form.create()(props => {
  const { form, hide, visible, refetch } = props


  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { name, type, rangeDate, value } = formData
        const d = {
          name,
          type,
          value: parseFloat(value),
          startDate: rangeDate[0].valueOf(),
          endDate: rangeDate[1].valueOf()
        }
        await client
          .mutate({
            mutation: ADD_DISCOUNT,
            variables: {
              input: d
            }
          })
          .then(async res => {
            if (res && res.data && res.data.createDiscount) {
              // eslint-disable-next-line
              const notify = new Notify(
                'success',
                'Add Discount successfully!',
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
      title='Create Discount'
      headerIcon='plus'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
      width='600px'
    >
      <Form>
        <Form.Item label='Name:'>
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please Enter Discount Name' }]
          })(<Input type='name' />)}
        </Form.Item>

        <Form.Item label='Type:'>
          {form.getFieldDecorator('type', {
            rules: [{ required: true, message: 'Please choose a type' }]
          })(
            <Select placeholder='Press to choose ...'>
              {typeCoupon.map(type => (
                <Select.Option key={type.value} value={type.value}>
                  {`${type.label} `}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item label='Value: '>
          {form.getFieldDecorator('value', {
            rules: [{ required: true, message: 'Please enter value' }]
          })(<Input type='number' />)}
        </Form.Item>


        <Form.Item label='Range Date: '>
          {form.getFieldDecorator('rangeDate', {
            initialValue: [moment(), moment()],
            rules: [
              {
                required: true,
                message: 'Please the date this discount affects and stops affecting'
              }
            ]
          })(
            <RangePicker format='DD/MM/YYYY' />
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default ModalAddDiscount