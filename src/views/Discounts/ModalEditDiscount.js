import { Modal, Form, Input, Select, DatePicker } from 'antd'
import React from 'react'
import { client } from 'config/client'
import { parseError } from 'helpers'
import { Notify } from 'helpers/notify'
import moment from 'moment'
import { UPDATE_DISCOUNT } from './query'

const { RangePicker } = DatePicker

const typeCoupon = [
  { value: 'DEDUCT', label: 'Khấu trừ' },
  { value: 'PERCENT', label: 'Phần trăm' }
]

const modalAddDiscount = Form.create()(props => {
  const { form, hide, visible, refetch, discount } = props


  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { name, type, value, rangeDate } = formData
        const d = {
          name,
          type,
          value: parseFloat(value),
          startDate: rangeDate[0].valueOf(),
          endDate: rangeDate[1].valueOf()
        }

        await client
          .mutate({
            mutation: UPDATE_DISCOUNT,
            variables: {
              discountId: discount._id,
              input: d
            }
          })
          .then(async res => {
            if (res && res.data && res.data.updateDiscount) {
              // eslint-disable-next-line
              const notify = new Notify(
                'success',
                'Discount updated successfully!',
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
      title='Update Discount Information'
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
            initialValue: discount ? discount.name : '',
            rules: [{ required: true, message: 'Please Enter Discount Name' }]
          })(<Input type='name' />)}
        </Form.Item>

        <Form.Item label='Type:'>
          {form.getFieldDecorator('type', {
            initialValue: discount ? discount.type : '',
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
            initialValue: discount ? discount.value : '',
            rules: [{ required: true, message: 'Please enter value' }]
          })(<Input type='number' />)}
        </Form.Item>


        <Form.Item label='Range Date: '>
          {form.getFieldDecorator('rangeDate', {
            initialValue:
              discount
                && discount.startDate
                && discount.endDate
                ? [moment(discount.startDate), moment(discount.endDate)] : [moment(), moment()],
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

export default modalAddDiscount
