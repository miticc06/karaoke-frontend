
import { Modal, Form, Input, Select } from 'antd'
import React, { useState, useEffect } from 'react'
import { client } from 'config/client'
import { parseError } from 'helpers'
import { Notify } from 'helpers/notify'
import { UPDATE_ROOM, GET_TYPES } from './query'

const ModalEditRoom = Form.create()(props => {
  const { form, hide, visible, refetch, room } = props
  const [state, setState] = useState({
    types: []
  })

  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { name, typeRoom } = formData
        const d = {
          name,
          typeRoom
        }
        await client
          .mutate({
            mutation: UPDATE_ROOM,
            variables: {
              roomId: room._id,
              input: d
            }
          })
          .then(async res => {
            if (res && res.data && res.data.updateRoom) {
              // eslint-disable-next-line
              const notify = new Notify(
                'success',
                'Room updated successfully!',
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

  const getTypeRoom = async () => {
    client
      .query({
        query: GET_TYPES
      })
      .then(res => {
        setState(prevState => ({
          ...prevState,
          types: res.data.typerooms
        }))
      })
      .catch(err => new Notify('error', parseError(err), 10))
  }

  useEffect(() => {
    getTypeRoom()
  }, [])

  return (
    <Modal
      title='Update Room Information'
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
            initialValue: room ? room.name : '',
            rules: [{ required: true, message: 'Please Enter room Name' }]
          })(<Input type='name' />)}
        </Form.Item>

        <Form.Item label='Type:'>
          {form.getFieldDecorator('typeRoom', {
            initialValue: room && room.typeRoom && room.typeRoom._id ? room.typeRoom._id : '',
            rules: [{ required: true, message: 'Please choose a type' }]
          })(
            <Select placeholder='Press to choose ...'>
              {state.types.map(type => (
                <Select.Option key={type._id} value={type._id}>
                  {`${type.name} | ${type.unitPrice}/hour`}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default ModalEditRoom
