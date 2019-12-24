import { Modal, Form, Input, Select } from 'antd'
import React, { useState } from 'react'
import { client } from 'config/client'
import { parseError } from 'helpers'
import { Notify } from 'helpers/notify'
import moment from 'moment'
import { UPDATE_DISCOUNT } from './query'
import { TimePicker } from './TimePicker'

const typeCoupon = [
  { value: 'DEDUCT', label: 'Khấu trừ' },
  { value: 'PERCENT', label: 'Phần trăm' }
]

const modalAddDiscount = Form.create()(props => {
  const { form, hide, visible, refetch, discount } = props
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { name, type, value } = formData
        const d = {
          name,
          type,
          value: parseFloat(value),
          startDate: startTime,
          endDate: endTime
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
                'Cập nhật thông tin khuyến mãi thành công!',
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
      title='Cập nhật thông tin khuyến mãi'
      headerIcon='edit'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
      width='600px'
    >
      <Form>
        <Form.Item label='Tên khuyến mãi'>
          {form.getFieldDecorator('name', {
            initialValue: discount ? discount.name : '',
            rules: [{ required: true, message: 'Hãy nhập tên khuyến mãi!' }]
          })(<Input type='name' />)}
        </Form.Item>

        <Form.Item label='Hình thức'>
          {form.getFieldDecorator('type', {
            initialValue: discount ? discount.type : '',
            rules: [{ required: true, message: 'Hãy chọn hình thức khuyến mãi!' }]
          })(
            <Select placeholder='Nhấp vào để chọn...'>
              {typeCoupon.map(type => (
                <Select.Option key={type.value} value={type.value}>
                  {`${type.label} `}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item label='Trị số'>
          {form.getFieldDecorator('value', {
            initialValue: discount ? discount.value : '',
            rules: [{ required: true, message: 'Hãy nhập trị số!' }]
          })(<Input type='number' />)}
        </Form.Item>


        <Form.Item label='Thời gian diễn ra khuyến mãi'>
          {form.getFieldDecorator('rangeDate', {
            initialValue:
              discount
                && discount.startDate
                && discount.endDate
                ? [moment(discount.startDate), moment(discount.endDate)] : [moment(), moment()],
            rules: [
              {
                required: true,
                message: 'Hãy chọn thời gian diễn ra khuyến mãi!'
              }
            ]
          })(
            // <RangePicker format='DD/MM/YYYY' />
            // eslint-disable-next-line max-len
            <TimePicker startTime={(discount && discount.startDate) ? moment(discount.startDate) : moment()} endTime={(discount && discount.endDate) ? moment(discount.endDate) : moment()} setStartTime={setStartTime} setEndTime={setEndTime} />
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default modalAddDiscount
