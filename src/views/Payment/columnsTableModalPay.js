import React from 'react'
import moment from 'moment'
import { FormatMoney } from 'helpers'

export const columnsRoomDetails = (endTime) => [
  {
    title: 'Giờ vào',
    dataIndex: 'startTime',
    key: 'startTime',
    render: data => moment(data).format('DD/MM/YY - HH:mm')
  },
  {
    title: 'Số giờ',
    key: 'so-gio',
    render: data => {
      let date1 = data.startTime
      let date2 = data.endTime || endTime
      let diff = date2 - date1
      let hours = Math.floor(diff / (1000 * 60 * 60))
      diff -= hours * (1000 * 60 * 60)

      let mins = Math.floor(diff / (1000 * 60))
      diff -= mins * (1000 * 60)
      return `${hours}:${mins}`
    }
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
    key: 'room.typeRoom.unitPrice',
    render: data => FormatMoney(data)
  },
  {
    title: 'Tổng',
    render: data => data.total
      ? FormatMoney(Math.round(data.total))
      : FormatMoney(Math.round(data.room.typeRoom.unitPrice * (((endTime - data.startTime) / 60000) / 60)))

  }
]


export const columnsServiceDetailsPerHOUR = (endTime) => [
  {
    title: 'Giờ bắt đầu',
    dataIndex: 'startTime',
    key: 'startTime',
    render: data => moment(data).format('DD/MM/YY - HH:mm')
  },
  {
    title: 'Giờ kết thúc',
    key: 'so-gio',
    render: data => (
      <div
        className='item-change-endTime'
      >
        {data.endTime ? (
          `${moment(data.endTime).format('HH:mm')}(${Math.round((data.endTime - data.startTime) / 60000)} phút)`
        ) : (
            `${endTime.format('HH:mm')}(${Math.round((endTime - data.startTime) / 60000)} phút)`
          )}
      </div>
    )

  },
  {
    title: 'Dịch vụ',
    dataIndex: 'service.name',
    key: 'service.name'
  },
  {
    title: 'Đơn giá (h)',
    dataIndex: 'service.unitPrice',
    key: 'service.unitPrice',
    render: data => FormatMoney(data)
  },
  {
    title: 'Thành tiền',
    render: data => {
      // if (data.service.type === 'perUNIT') {
      //   return Math.round(data.quantity * data.service.unitPrice)
      // }
      if (data.service.type === 'perHOUR' && data.endTime) {
        return FormatMoney(Math.round(data.service.unitPrice * (((data.endTime - data.startTime) / 60000) / 60)))
      }
      return FormatMoney(Math.round(data.service.unitPrice * (((endTime - data.startTime) / 60000) / 60)))
    }
  }
]


export const columnsServiceDetailsPerUNIT = [
  {
    title: 'Dịch vụ',
    dataIndex: 'service.name',
    key: 'service.name'
  },
  {
    title: 'Đơn giá',
    dataIndex: 'service.unitPrice',
    key: 'service.unitPrice',
    render: text => FormatMoney(text)
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity'
  },
  {
    title: 'Thành tiền',
    render: data => {
      if (data.service.type === 'perUNIT') {
        return data.total ? FormatMoney(data.total) : FormatMoney(data.quantity * data.service.unitPrice)
      }
      return '...'
    }
  }
]