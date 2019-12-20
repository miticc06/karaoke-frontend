import React from 'react'
import moment from 'moment'
import { FormatMoney } from 'helpers'
import { has } from 'mobx'

export const columnsdefs = [
  {
    title: 'Thời gian',
    dataIndex: 'createdAt',
    render: createdAt => moment(createdAt).format('DD/MM/YYYY HH:MM')
  },
  {
    title: 'Phòng',
    render: data => {
      const hash = {}
      const arr = []
      data.roomDetails.forEach(obj => {
        if (!hash[obj.room._id]) {
          hash[obj.room._id] = true
          arr.push(obj.room.name)
        }
      })
      return arr.join(', ')
    }
  },
  {
    title: 'Tiền phòng',
    dataIndex: 'roomDetails',
    render: roomDetails => FormatMoney(roomDetails.reduce((total, obj) => total + obj.total, 0))
  },
  {
    title: 'Tiền dịch vụ',
    dataIndex: 'serviceDetails',
    render: serviceDetails => FormatMoney(serviceDetails.reduce((total, obj) => total + obj.total, 0))
  },
  {
    title: 'Thành tiền',
    render: data => FormatMoney(data.total)
  }
]