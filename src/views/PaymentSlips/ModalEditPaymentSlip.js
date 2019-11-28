/* eslint-disable no-useless-escape */
import { Modal, Form, Input, Select } from 'antd'
import React, { useState, useEffect } from 'react'
import { client } from 'config/client'
import { parseError } from 'helpers'
import { Notify } from 'helpers/notify'
import { UPDATE_PAYMENTSLIP } from './query'

const ModalEditPaymentSlip = Form.create()(props => {
  const { form, hide, visible, refetch, paymentSlip } = props
  const [state, setState] = useState({})

  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { description, sprice } = formData
        // eslint-disable-next-line radix
        const price = parseInt(sprice)
        await client
          .mutate({
            mutation: UPDATE_PAYMENTSLIP,
            variables: {
              paymentSlipId: paymentSlip._id,
              input: {
                description,
                price
              }
            }
          })
          .then(async res => {
            if (res && res.data && res.data.updatePaymentSlip) {
              // eslint-disable-next-line
              const notify = new Notify('success', 'Cập nhật payment-slip thành công!', 2)
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

  console.log(state.roles)

  return (
    <Modal
      title='Cập nhật Payment Slip'
      headerIcon='edit'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
      width='600px'
    >
      <Form>
        <Form.Item label='Description'>
          {form.getFieldDecorator('description', {
            initialValue: paymentSlip && paymentSlip.description ? paymentSlip.description : '',
            rules: [{ required: true, message: 'Hãy nhập thông tin payment-slip' }]
          })(<Input type='description' />)}
        </Form.Item>

        <Form.Item label='Price'>
          {form.getFieldDecorator('sprice', {
            initialValue: paymentSlip && paymentSlip.price ? paymentSlip.price : '',
            rules: [
              { required: true, message: 'Hãy nhập giá tiền.' },
              {
                pattern: /^[1-9][0-9]*$/gm,
                message: 'Price chỉ bao gồm số.'
              }
            ]
          })(<Input type='price' />)}
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default ModalEditPaymentSlip
