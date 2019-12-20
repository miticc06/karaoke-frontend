import { Modal, Form, Input, Select } from 'antd'
import React, { useEffect } from 'react'
import { client } from 'config/client'
import { parseError } from 'helpers'
import { Notify } from 'helpers/notify'
import { UPDATE_TICKET } from './query'

const ModalEditTicket = Form.create()(props => {
  const { form, hide, visible, refetch, ticket, rooms, statusOptions } = props

  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { subject, room, status } = formData
        await client
          .mutate({
            mutation: UPDATE_TICKET,
            variables: {
              ticketId: ticket._id,
              input: {
                subject,
                room,
                status
              }
            }
          })
          .then(async res => {
            if (res && res.data && res.data.updateTicket) {
              // eslint-disable-next-line
              const notify = new Notify('success', 'Cập nhật ticket thành công!', 2)
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

  useEffect(() => {
  }, [])

  return (
    <Modal
      title='Cập nhật Ticket'
      headerIcon='edit'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
      width='600px'
    >
      <Form>
        <Form.Item label='Subject'>
          {form.getFieldDecorator('subject', {
            initialValue: ticket && ticket.subject ? ticket.subject : '',
            rules: [{ required: true, message: 'Vui lòng nhập tiêu đề.' }]
          })(<Input type='text' />)}
        </Form.Item>

        <Form.Item label='Room'>
          {form.getFieldDecorator('room', {
            rules: [{ required: true, message: 'Vui lòng chọn phòng.' }],
            initialValue: ticket && ticket.room ? ticket.room._id : ''
          })(
            <Select placeholder='Please select room ...'>
              {rooms.map(room => (
                <Select.Option key={room._id} value={room._id}>
                  {room.name}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item label='Status'>
          {form.getFieldDecorator('status', {
            rules: [{ required: true, message: 'Vui lòng chọn trạng thái.' }],
            initialValue: ticket && ticket.status
          })(
            <Select placeholder='Please select room ...'>
              {statusOptions.map(status => (
                <Select.Option key={status.value} value={status.value}>
                  {status.label}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default ModalEditTicket
