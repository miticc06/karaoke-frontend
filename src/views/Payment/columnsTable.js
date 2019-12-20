import React from 'react'
import moment from 'moment'
import { Button } from 'antd'
import { FormatMoney } from 'helpers'

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
    render: data => {
      let date1 = data.startTime
      let date2 = data.endTime || moment()
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
    dataIndex: 'total',
    render: data => data ? FormatMoney(Math.round(data)) : '...'

  }
]


export const columnsServiceDetailsPerHOUR = (
  handleUpdateQuantityItem,
  setVisibleChangeEndTimeService,
  setServiceNeedChangeEndTime
) => [
    {
      render: data => (
        <Button
          type='link'
          icon='close'
          style={{ color: 'red' }}
          onClick={() => handleUpdateQuantityItem(data.service._id, data.startTime, 0)}
        />
      )
    },
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
          onClick={() => {
            setVisibleChangeEndTimeService(true)
            setServiceNeedChangeEndTime(data)
          }}
        >
          {data.endTime ? (
            `${moment(data.endTime).format('HH:mm')}(${Math.round((data.endTime - data.startTime) / 60000)} phút)`
          ) : (
              `... (${Math.round((moment() - data.startTime) / 60000)} phút)`
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
        //   return FormatMoney(Math.round(data.quantity * data.service.unitPrice))
        // }
        if (data.service.type === 'perHOUR' && data.endTime) {
          return FormatMoney(Math.round(data.service.unitPrice * (((data.endTime - data.startTime) / 60000) / 60)))
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
        onClick={() => handleUpdateQuantityItem(data.service._id, data.startTime, 0)}
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
    key: 'service.unitPrice',
    render: data => FormatMoney(data)
  },
  {
    title: 'Số lượng',
    render: data => (
      <>
        <Button
          type='link'
          icon='down'
          onClick={() => handleUpdateQuantityItem(data.service._id, data.startTime, data.quantity - 1)}
        />
        {data.quantity}
        <Button
          type='link'
          icon='up'
          onClick={() => handleUpdateQuantityItem(data.service._id, data.startTime, data.quantity + 1)}
        />
      </>
    )

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