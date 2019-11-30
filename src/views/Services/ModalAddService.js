/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable no-useless-escape */
import { Modal, Form, Input, Select } from 'antd'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import React, { useState, useEffect } from 'react'
import { client } from 'config/client'
import { parseError } from 'helpers'
import { Notify } from 'helpers/notify'
import { ADD_SERVICE } from './query'

const modalAddService = Form.create()(props => {
  const { form, hide, visible, refetch } = props
  const [state, setState] = useState({
    types: [
      { value: 'perHOUR', label: 'perHOUR' },
      { value: 'perUNIT', label: 'perUNIT' }
    ]
  })

  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { name, type, unitPrice } = formData
        const d = {
          name,
          type,
         unitPrice: parseFloat(unitPrice)
        }
        await client
          .mutate({
            mutation: ADD_SERVICE,
            variables: {
              input: d
            }
          })
          .then(async res => {
            if (res && res.data && res.data.createService) {
              // eslint-disable-next-line
              const notify = new Notify(
                'success',
                'Add Service successfully!',
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
      title='Create Service'
      headerIcon='plus'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
      width='600px'
    >
      <Form>
        <Form.Item label='Name:'>
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please Enter Service Name' }]
          })(<Input type='name' />)}
        </Form.Item>

        <Form.Item label='Type:'>
          {form.getFieldDecorator('type', {
            rules: [{ required: true, message: 'Please choose a type' }]
          })(
            <Select placeholder='Press to choose ...'>
              {state.types.map(type => (
                <Select.Option key={type.value} value={type.label}>
                  {`${type.value} `}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item label='Price: '>
          {form.getFieldDecorator('unitPrice', {
            rules: [{ required: true, message: 'Please enter price' }]
          })(<Input type='number' />)}
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default modalAddService
