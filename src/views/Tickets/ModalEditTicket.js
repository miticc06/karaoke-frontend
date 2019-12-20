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
              const notify = new Notify('success', 'Cập nhật thông tin yêu cầu thành công!', 2)
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
      title='Cập nhật thông tin yêu cầu'
      headerIcon='edit'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
      width='600px'
    >
      <Form>
        <Form.Item label='Tiêu đề'>
          {form.getFieldDecorator('subject', {
            initialValue: ticket && ticket.subject ? ticket.subject : '',
            rules: [{ required: true, message: 'Hãy nhập tiêu đề!' }]
          })(<Input type='text' />)}
        </Form.Item>

        <Form.Item label='Phòng hát'>
          {form.getFieldDecorator('room', {
            rules: [{ required: true, message: 'Hãy chọn phòng hát!' }],
            initialValue: ticket && ticket.room ? ticket.room._id : ''
          })(
            <Select placeholder='Nhấp để chọn...'>
              {rooms.map(room => (
                <Select.Option key={room._id} value={room._id}>
                  {room.name}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item label='Trạng thái'>
          {form.getFieldDecorator('status', {
            rules: [{ required: true, message: 'Hãy chọn trạng thái!' }],
            initialValue: ticket && ticket.status
          })(
            <Select placeholder='Nhấp để chọn...'>
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
