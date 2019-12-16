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


export const columnsServiceDetailsPerUNIT = (handleUpdateQuantityItem) => [
  {
    render: data => (
      <Button
        type='link'
        icon='close'
        style={{ color: 'red' }}
        onClick={() => handleUpdateQuantityItem(data.service._id, 0)}
      />
    )
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
    // dataIndex: 'quantity',
    render: data => {
      console.log(data)
      return (
        <>
          <Button
            type='link'
            icon='down'
            onClick={() => handleUpdateQuantityItem(data.service._id, data.quantity - 1)}
          />
          {data.quantity}
          <Button
            type='link'
            icon='up'
            onClick={() => handleUpdateQuantityItem(data.service._id, data.quantity + 1)}
          />
        </>
      )
    }
  },
  {
    title: 'Thành tiền',
    render: data => {
      if (data.service.type === 'perUNIT') {
        return data.total || (data.quantity * data.service.unitPrice)
      }
      return '...'
    }
  }
]