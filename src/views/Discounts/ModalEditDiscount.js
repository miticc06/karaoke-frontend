/* eslint-disable linebreak-style */
/* eslint-disable no-useless-escape */
import { Modal, Form, Input, Select } from 'antd'
import React, { useState, useEffect } from 'react'
import { client } from 'config/client'
import { parseError } from 'helpers'
import { Notify } from 'helpers/notify'
import { UPDATE_DISCOUNT } from './query'

const modalAddDiscount = Form.create()(props => {
  const { form, hide, visible, refetch, discount } = props
  const [state, setState] = useState({
    types: [
      { value: 'DEDUCT', label: 'DEDUCT' },
      { value: 'PERCENT', label: 'PERCENT' }
    ]
  })

  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { name, type, startDate, endDate, value } = formData
        const d = {
          name,
          type,
          value: parseFloat(value),
          startDate: new Date(startDate).getTime(),
          endDate: new Date(endDate).getTime()
        }
        console.log(JSON.stringify(d))
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
                'Discount updated successfully!',
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
      title='Update Discount Information'
      headerIcon='edit'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
      width='600px'
    >
      <Form>
        <Form.Item label='Name:'>
          {form.getFieldDecorator('name', {
             initialValue: discount ? discount.name : '',
            rules: [{ required: true, message: 'Please Enter Discount Name' }]
          })(<Input type='name' />)}
        </Form.Item>

        <Form.Item label='Type:'>
          {form.getFieldDecorator('type', {
             initialValue: discount ? discount.type : '',
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

        <Form.Item label='Value: '>
          {form.getFieldDecorator('value', {
             initialValue: discount ? discount.value : '',
            rules: [{ required: true, message: 'Please enter value' }]
          })(<Input type='number' />)}
        </Form.Item>

        <Form.Item label='Start Date: '>
          {form.getFieldDecorator('startDate', {
            initialValue: discount ? discount.startDate : '',
            rules: [
              {
                required: true,
                message: 'Please the date this discount affects'
              }
            ]
          })(<Input type='date' />)}
        </Form.Item>

        <Form.Item label='End Date: '>
          {form.getFieldDecorator('endDate', {
             initialValue: discount ? discount.endDate : '',
            rules: [
              {
                required: true,
                message: 'Please the date this discount stops affecting'
              }
            ]
          })(<Input type='date' />)}
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default modalAddDiscount
