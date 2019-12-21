
import { Modal, Form, Input, Select } from 'antd'
import React, { useState, useEffect } from 'react'
import { client } from 'config/client'
import { parseError, FormatMoney } from 'helpers'
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
                'Cập nhật thông tin phòng hát thành công!',
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
      title='Cập nhật thông tin phòng hát'
      headerIcon='edit'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
      width='600px'
    >
      <Form>
        <Form.Item label='Tên phòng hát'>
          {form.getFieldDecorator('name', {
            initialValue: room ? room.name : '',
            rules: [{ required: true, message: 'Hãy nhập tên phòng hát!' }]
          })(<Input type='name' />)}
        </Form.Item>

        <Form.Item label='Loại phòng'>
          {form.getFieldDecorator('typeRoom', {
            initialValue: room && room.typeRoom && room.typeRoom._id ? room.typeRoom._id : '',
            rules: [{ required: true, message: 'Hãy nhập loại phòng hát!' }]
          })(
            <Select placeholder='Nhấp vào để chọn'>
              {state.types.map(type => (
                <Select.Option key={type._id} value={type._id}>
                  {`${type.name} | ${FormatMoney(`${type.unitPrice}`)} VND/hour`}
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
