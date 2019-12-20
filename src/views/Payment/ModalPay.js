/* eslint-disable react-hooks/exhaustive-deps */

import { Modal, Form, Select, Table, InputNumber } from 'antd'
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { client } from 'config/client'
import { FormatMoney } from 'helpers'
import { columnsRoomDetails, columnsServiceDetailsPerHOUR, columnsServiceDetailsPerUNIT } from './columnsTableModalPay'
import { GET_DISCOUNTS, UPDATE_CUSTOMER } from './query'

const { Option } = Select

const ModalPay = Form.create()(props => {
  const [discounts, setDiscounts] = useState([])
  const [endTime, setEndTime] = useState(moment())
  const { form, hide, visible, bill, handleUpdateBill } = props

  const onSubmit = async () => {
    await form.validateFields(async (errors, formData) => {
      if (!errors) {
        const { total, coupon } = formData
        const newBill = {
          ...bill,
          discount: coupon,
          total,
          state: 20
        }

        newBill.roomDetails = newBill.roomDetails.map(roomDetail => {
          if (!roomDetail.total) {
            roomDetail.endTime = +endTime
            roomDetail.total = Math.round(roomDetail.room.typeRoom.unitPrice * (((roomDetail.endTime - roomDetail.startTime) / 60000) / 60))
          }
          return roomDetail
        })
        newBill.serviceDetails = newBill.serviceDetails.map(serviceDetail => {
          if (!serviceDetail.total) {
            if (serviceDetail.service.type === 'perUNIT') {
              serviceDetail.total = Math.round(serviceDetail.quantity * serviceDetail.service.unitPrice)
            }
            if (serviceDetail.service.type === 'perHOUR') {
              if (!serviceDetail.endTime) {
                serviceDetail.endTime = +endTime
              }
              serviceDetail.total = Math.round(serviceDetail.service.unitPrice * (((serviceDetail.endTime - serviceDetail.startTime) / 60000) / 60))
            }
          }
          return serviceDetail
        })

        if (newBill.customer) {
          const newCustomer = {
            ...newBill.customer,
            points: newBill.customer.points + Math.round(total / 10000)
          }
          delete newCustomer._id

          await client
            .mutate({
              mutation: UPDATE_CUSTOMER,
              variables: {
                id: newBill.customer._id,
                input: newCustomer
              }
            })
        }

        await handleUpdateBill(bill._id, newBill, `Thanh toán thành công hóa đơn ${FormatMoney(total)} VNĐ`)
        hide()
      }
    })
  }

  const getDiscount = async () => {
    await client.query({
      query: GET_DISCOUNTS
    }).then(res => {
      setDiscounts(res.data.discounts)
    })
  }

  useEffect(() => {
    getDiscount()
    form.resetFields()
    setEndTime(moment())
  }, [visible])

  const servicesPerHour = bill && bill.serviceDetails ? bill.serviceDetails.filter(obj => obj.service.type === 'perHOUR') : []
  const servicesPerUnit = bill && bill.serviceDetails ? bill.serviceDetails.filter(obj => obj.service.type === 'perUNIT') : []

  const calTotal = () => {
    if (!bill) { return 0 }

    const totalRooms = bill.roomDetails.reduce((total, obj) => {
      if (obj.total) {
        return total + obj.total
      }
      return total + obj.room.typeRoom.unitPrice * (((endTime - obj.startTime) / 60000) / 60)
    }, 0)

    const totalServicesPerHour = servicesPerHour.reduce((total, obj) => {
      if (obj.total) {
        return total + obj.total
      }
      if (obj.endTime) {
        return total + (obj.service.unitPrice * (((obj.endTime - obj.startTime) / 60000) / 60))
      }
      return total + (obj.service.unitPrice * (((endTime - obj.startTime) / 60000) / 60))
    }, 0)


    const totalServicesPerUnit = servicesPerUnit.reduce((total, obj) => {
      if (obj.total) {
        return total + obj.total
      }
      return total + (obj.quantity * obj.service.unitPrice)
    }, 0)

    if (form.getFieldsValue().coupon) {
      const coupon = discounts.find(discount => discount._id === form.getFieldsValue().coupon)
      if (coupon.type === 'PERCENT') {
        return (totalRooms + totalServicesPerHour + totalServicesPerUnit) * (coupon.value / 100)
      }
      if (coupon.type === 'DEDUCT') {
        return Math.max(0, (totalRooms + totalServicesPerHour + totalServicesPerUnit) - coupon.value)
      }
    }
    return totalRooms + totalServicesPerHour + totalServicesPerUnit
  }


  return (
    <Modal
      title='Thanh toán Hóa đơn dịch vụ'
      headerIcon='edit'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      onOk={onSubmit}
      width={700}
    >

      <div className='top-bill'>
        <div className='group-list-room-details'>
          <div className='title-list-room-details'>
            Dịch vụ phòng
          </div>
          <Table
            className='list-room-details'
            columns={columnsRoomDetails(endTime)}
            dataSource={bill && bill.roomDetails}
            pagination={false}
          />
        </div>

        {servicesPerHour.length > 0 ? (
          <div className='group-list-service-details'>
            <div className='title-list-service-details'>
              Dịch vụ theo giờ
            </div>
            <Table
              className='list-service-details'
              columns={columnsServiceDetailsPerHOUR(endTime)}
              dataSource={servicesPerHour}
              pagination={false}
            />
          </div>
        ) : ''}

        {servicesPerUnit.length > 0 ? (
          <div className='group-list-service-details'>
            <div className='title-list-service-details'>
              Dịch vụ theo lượt
            </div>
            <Table
              className='list-service-details'
              columns={columnsServiceDetailsPerUNIT}
              dataSource={servicesPerUnit}
              pagination={false}
            />
          </div>
        ) : ''}

      </div>


      <Form>
        <Form.Item label='Chọn coupon'>
          {form.getFieldDecorator('coupon', {
          })(
            <Select
              showSearch
              style={{ width: 300 }}
              placeholder='Chọn coupon'
              allowClear
            >
              {discounts.map(discount => (
                <Option key={discount._id} value={discount._id}>{discount.name}</Option>
              ))}

            </Select>
          )}
        </Form.Item>

        <Form.Item label='Tổng thành tiền'>
          {form.getFieldDecorator('total', {
            initialValue: bill && Math.round(calTotal())
          })(
            <InputNumber
              disabled
              style={{ width: 300 }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
            // <Input
            //   disabled

            //   style={{ width: 300 }}
            // />
          )}
        </Form.Item>

      </Form>
    </Modal>
  )
})

export default ModalPay
