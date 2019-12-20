/* eslint-disable react-hooks/exhaustive-deps */

import { Modal, Form, Select } from 'antd'
import React, { useEffect } from 'react'
import moment from 'moment'

const { Option } = Select


const ModalChangeRoom = Form.create()(props => {
  const { form, hide, visible, roomSelected, rooms, bill, handleUpdateBill } = props

  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { newRoomId } = formData

        const newBill = {
          ...bill
        }
        const lastRoom = newBill.roomDetails[newBill.roomDetails.length - 1]

        lastRoom.endTime = +moment()
        lastRoom.total = lastRoom.room.typeRoom.unitPrice * (((lastRoom.endTime - lastRoom.startTime) / 60000) / 60)
        const findRoom = rooms.find(obj => obj._id === newRoomId)

        newBill.roomDetails.push({
          room: {
            _id: findRoom._id,
            name: findRoom.name,
            typeRoom: findRoom.typeRoom
          },
          startTime: +moment()
        })

        await handleUpdateBill(bill._id, newBill)
        hide()
      }
    })
  }

  useEffect(() => {
    form.resetFields()
  }, [visible])

  return (
    <Modal
      title='Đổi phòng'
      headerIcon='edit'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
    >
      <Form>
        <Form.Item label='Chọn phòng'>
          {form.getFieldDecorator('newRoomId', {
            rules: [{ required: true, message: 'Hãy chọn phòng mới cần đổi' }]
          })(
            <Select
              showSearch
              style={{ width: 300 }}
              placeholder='Chọn phòng mới'
              notFoundContent='Không còn phòng trống nào!'
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {roomSelected && rooms && rooms.filter(roo => !roo.bill && roo._id !== roomSelected._id)
                .map(obj => (
                  <Option value={obj._id} key={obj._id}>{obj.name}</Option>

                ))}
            </Select>
          )}
        </Form.Item>

      </Form>
    </Modal>
  )
})

export default ModalChangeRoom
