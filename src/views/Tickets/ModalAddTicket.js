import { Modal, Form, Input, Select } from 'antd'
import React from 'react'
import { client } from 'config/client'
import { parseError } from 'helpers'
import { Notify } from 'helpers/notify'
import { ADD_TICKET } from './query'

const ModalAddTicket = Form.create()(props => {
  const { form, hide, visible, refetch, rooms, statusOptions, roomNeedAddTicket } = props

  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { subject, room, status } = formData
        await client
          .mutate({
            mutation: ADD_TICKET,
            variables: {
              input: {
                subject,
                room,
                status
              }
            }
          })
          .then(async res => {
            if (res && res.data && res.data.createTicket) {
              // eslint-disable-next-line
              const notify = new Notify('success', 'Thêm ticket thành công!', 2)
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
      title='Thêm Ticket'
      headerIcon='plus'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
      width='600px'
    >
      <Form>
        <Form.Item label='Subject'>
          {form.getFieldDecorator('subject', {
            rules: [{ required: true, message: 'Hãy nhập tiêu đề.' }]
          })(<Input type='text' />)}
        </Form.Item>

        <Form.Item label='Room'>
          {form.getFieldDecorator('room', {
            rules: [{ required: true, message: 'Hãy nhập số phòng.' }],
            initialValue: roomNeedAddTicket && roomNeedAddTicket._id
          })(
            <Select
              disabled={roomNeedAddTicket && roomNeedAddTicket._id}
              placeholder='Please select room ...'
            >
              {rooms.map(room => (
                <Select.Option key={room._id} value={room._id}>
                  {room.name}
                </Select.Option>
              ))}
              {roomNeedAddTicket && (
                <Select.Option key={roomNeedAddTicket._id} value={roomNeedAddTicket._id}>
                  {roomNeedAddTicket.name}
                </Select.Option>
              )}
            </Select>
          )}
        </Form.Item>

        <Form.Item label='Status'>
          {form.getFieldDecorator('status', {
            rules: [{ required: true, message: 'Hãy chọn trạng thái.' }],
            initialValue: 'OPEN'
          })(<Select
            disabled
            options={statusOptions}
          />)}
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default ModalAddTicket
