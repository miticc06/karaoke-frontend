import React from 'react'
import moment from 'moment'
import { Button } from 'antd'

export const columnsRoomDetails = [
  {
    title: 'Giờ vào',
    dataIndex: 'startTime',
    key: 'startTime',
    render: data => moment(data).format('DD/MM/YY - HH:mm')
  },
  {
    title: 'Số giờ',
    key: 'so-gio',
    dataIndex: 'startTime',
    render: data => moment(+moment() - data).format('HH:mm')
  },
  {
    title: 'Phòng',
    dataIndex: 'room.name',
    key: 'room.name'
  },
  {
    title: 'Loại phòng',
    dataIndex: 'room.typeRoom.name',
    key: 'room.typeRoom.name'
  },
  {
    title: 'Đơn giá',
    dataIndex: 'room.typeRoom.unitPrice',
    key: 'room.typeRoom.unitPrice'
  },
  {
    title: 'Tổng',
    render: data => {
      console.log(data)
      return '...'
    }
  }
]


export const columnsServiceDetailsPerHOUR = [
  {
    title: 'Giờ',
    dataIndex: 'startTime',
    key: 'startTime',
    render: data => moment(data).format('DD/MM/YY - HH:mm')
  },
  {
    title: 'Số giờ',
    key: 'so-gio',
    dataIndex: 'startTime',
    render: data => moment(+moment() - data).format('HH:mm')
  },
  {
    title: 'Dịch vụ',
    dataIndex: 'service.name',
    key: 'service.name'
  },
  {
    title: 'Đơn giá',
    dataIndex: 'service.unitPrice',
    key: 'service.unitPrice'
  },
  {
    title: 'Thành tiền',
    render: data => {
      if (data.service.type === 'perUNIT') {
        return data.quantity * data.service.unitPrice
      }
      return '...'
    }
  }
]


export const columnsServiceDetailsPerUNIT = [
  {
    render: data => <Button type='link' icon='close' style={{ color: 'red' }} />
  },
  {
    title: 'Dịch vụ',
    dataIndex: 'service.name',
    key: 'service.name'
  },
  {
    title: 'Đơn giá',
    dataIndex: 'service.unitPrice',
    key: 'service.unitPrice'
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    key: 'quantity',
    render: data => {
      console.log(data)
      return (
        <>
          <Button type='link' icon='down' />
          {data}
          <Button type='link' icon='up' />
        </>
      )
    }
  },
  {
    title: 'Thành tiền',
    render: data => {
      if (data.service.type === 'perUNIT') {
        return data.quantity * data.service.unitPrice
      }
      return '...'
    }
  }
]