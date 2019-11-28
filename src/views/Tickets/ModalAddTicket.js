/* eslint-disable no-useless-escape */
import { Modal, Form, Input } from 'antd'
import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { client } from 'config/client'
import { parseError } from 'helpers'
import { Notify } from 'helpers/notify'
import { ADD_TICKET } from './query'

const ModalAddTicket = Form.create()(props => {
  const { form, hide, visible, refetch, roomOptions, statusOptions } = props
  
  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { subject, selectedRoom, selectedStatus } = formData
        const room = selectedRoom.value
        const status = selectedStatus.value

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
          {form.getFieldDecorator('selectedRoom', {
            rules: [{ required: true, message: 'Hãy nhập số phòng.' }]
          })(<Select 
            options={roomOptions} 
          />)}
        </Form.Item>

        <Form.Item label='Status'>
          {form.getFieldDecorator('selectedStatus', {
            rules: [{ required: true, message: 'Hãy nhập trạng thái.' }]
          })(<Select 
            options={statusOptions}
          />)}
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default ModalAddTicket
