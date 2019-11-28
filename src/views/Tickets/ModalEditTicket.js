import { Modal, Form, Input, Select } from 'antd'
import React, { useState, useEffect } from 'react'
import ReactSelect from 'react-select'
import { client } from 'config/client'
import { parseError } from 'helpers'
import { Notify } from 'helpers/notify'
import { UPDATE_TICKET } from './query'

const ModalEditTicket = Form.create()(props => {
  const { form, hide, visible, refetch, ticket, roomOptions, statusOptions } = props

  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { subject, selectedRoom, selectedStatus } = formData
        const room = selectedRoom.value
        const status = selectedStatus.value

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
            rules: [{ required: true, message: 'Hãy nhập tiêu đề.' }]
          })(<Input type='text' />)}
        </Form.Item>

        <Form.Item label='Room'>
          {form.getFieldDecorator('selectedRoom', {
            rules: [{ required: true, message: 'Hãy nhập số phòng.' }],
            initialValue: ticket && ticket.room ? { label: ticket.room.name, value: ticket.room._id } : { label: '', value: '' }
          })(<ReactSelect 
            options={roomOptions} 
          />)}
        </Form.Item>

        <Form.Item label='Status'>
          {form.getFieldDecorator('selectedStatus', {
            rules: [{ required: true, message: 'Hãy nhập trạng thái.' }],
            initialValue: ticket && ticket.status ? { label: ticket.status, value: ticket.status } : { label: '', value: '' }
          })(<ReactSelect 
            options={statusOptions} 
          />)}
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default ModalEditTicket
