import { Modal, Form, Input, Select, DatePicker } from 'antd'
import React, { useState } from 'react'
import moment from 'moment'
import { client } from 'config/client'
import { parseError } from 'helpers'
import { Notify } from 'helpers/notify'
import { ADD_DISCOUNT } from './query'
import { TimePicker } from './TimePicker'

const { RangePicker } = DatePicker

const typeCoupon = [
  { value: 'DEDUCT', label: 'Khấu trừ' },
  { value: 'PERCENT', label: 'Phần trăm' }
]

const ModalAddDiscount = Form.create()(props => {
  const { form, hide, visible, refetch } = props
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { name, type, rangeDate, value } = formData
        const d = {
          name,
          type,
          value: parseFloat(value),
          startDate: startTime,
          endDate: endTime
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
                'Thêm mới khuyến mãi thành công!',
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
      title='Thêm mới khuyến mãi'
      headerIcon='plus'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
      width='600px'
    >
      <Form>
        <Form.Item label='Tên khuyến mãi'>
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: 'Hãy nhập tên khuyến mãi!' }]
          })(<Input type='name' />)}
        </Form.Item>

        <Form.Item label='Hình thức'>
          {form.getFieldDecorator('type', {
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
            rules: [{ required: true, message: 'Hãy nhập trị số!' }]
          })(<Input type='number' />)}
        </Form.Item>


        <Form.Item label='Thời gian diễn ra khuyến mãi'>
          {form.getFieldDecorator('rangeDate', {
            initialValue: [moment(), moment()],
            rules: [
              {
                required: true,
                message: 'Hãy chọn thời gian diễn ra khuyến mãi!'
              }
            ]
          })(
            // <RangePicker format='DD/MM/YYYY' />
            <TimePicker setStartTime={setStartTime} setEndTime={setEndTime} />
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default ModalAddDiscount