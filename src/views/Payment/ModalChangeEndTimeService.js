/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Form, Input, Switch, TimePicker } from 'antd'
import React, { useState, useEffect } from 'react'
import moment from 'moment'


const ModalChangeEndTimeService = Form.create()(props => {
  const { form, hide, visible, service, bill, handleUpdateBill } = props
  const [check, setCheck] = useState(false)

  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { endTime, minute } = formData
        let value = 0
        if (minute) {
          value = service.startTime + minute * 60000
        } else {
          value = endTime.valueOf()
        }

        const newBill = {
          ...bill
        }

        const indexService = newBill.serviceDetails.findIndex(obj => obj.service._id === service.service._id && service.startTime === obj.startTime)
        newBill.serviceDetails[indexService].endTime = value
        await handleUpdateBill(bill._id, newBill)
        hide()
      }
    })
  }

  useEffect(() => {
    form.resetFields()
  }, [service])
  return (
    <Modal
      title='Cập nhật giờ sử dụng'
      headerIcon='edit'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
    >
      <Switch
        checkedChildren='Nhập số phút sử dụng'
        unCheckedChildren='Nhập thời điểm kết thúc'
        defaultChecked={check}
        onChange={() => setCheck(prevState => !prevState)}
      />
      <Form>
        {check && (
          <Form.Item label='Kết thúc lúc'>
            {form.getFieldDecorator('endTime', {
              initialValue: service && service.endTime ? moment(service.endTime) : null,
              rules: [{ required: true, message: 'Hãy chọn thời gian kết thúc' }]
            })(
              <TimePicker format='HH:mm' />
            )}
          </Form.Item>
        )}

        {!check && (
          <Form.Item label='Thời lượng sử dụng (Phút)'>
            {form.getFieldDecorator('minute', {
              initialValue: service && service.endTime ? (service.endTime - service.startTime) / 60000 : null,
              rules: [{ required: true, message: 'Hãy nhập thời lượng sử dụng' }]
            })(
              <Input type='number' min='1' />
            )}
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
})

export default ModalChangeEndTimeService
