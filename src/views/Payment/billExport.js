/* eslint-disable no-array-constructor */
/* eslint-disable prefer-spread */
import React, { PureComponent } from 'react'
import { Button } from 'antd'
import moment from 'moment'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const changeAlias = (alias) => {
  let str = alias.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
  return str
}

const getDiffMoment = (startTime, endTime) => {
  let ms = moment(endTime).diff(moment(startTime))
  let d = moment.duration(ms)
  let s = Math.floor(d.asHours()) + moment.utc(ms).format(':mm')
  return s
}

export const BillExport = (bill, discount) => {
  let { roomDetails } = bill
  console.log(bill)

  let servicePerHourDetails = bill.serviceDetails ? bill.serviceDetails.filter(x => x.service.type === 'perHOUR') : []
  let servicePerUnitDetails = bill.serviceDetails ? bill.serviceDetails.filter(x => x.service.type === 'perUNIT') : []

  let roomTableHeaders = ['Tu', 'Den', 'Phong', 'SL', 'Don gia', 'Thanh tien']
  let servicePerHourTableHeaders = ['Tu', 'Den', 'Dich vu', 'SL', 'Don gia', 'Thanh tien']
  let servicePerUnitTableHeaders = ['Dich vu', 'SL', 'Don gia', 'Thanh tien']

  // eslint-disable-next-line new-cap
  let doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a5'
  })

  let width = doc.internal.pageSize.getWidth()
  let height = doc.internal.pageSize.getHeight()
  doc.setFont('helvetica')

  const startRowHeader = 20
  const startRowBody = 50
  const startRowFooter = startRowBody + 40
    + (roomDetails.length + 2) * 8
    + (servicePerHourDetails.length > 0 ? (servicePerHourDetails.length + 2) * 8 : 0)
    + (servicePerUnitDetails.length > 0 ? (servicePerUnitDetails.length + 2) * 8 : 0)

  // header
  doc.setFontSize(16)
  doc.setFontStyle('bold')
  doc.text('KARAOKE THOUSAND-STARS', width / 2, startRowHeader, 'center')

  doc.setFontSize(10)
  doc.setFontStyle('normal')
  doc.text(changeAlias('Trường Đại học Công nghệ thông tin - DHQG HCM'), width / 2, startRowHeader + 6, 'center')
  doc.text(changeAlias('Khu phố 6, phường Linh Trung, Thủ Đức, HCM'), width / 2, startRowHeader + 10, 'center')
  doc.text(changeAlias('Hotline: 028 3725 2002'), width / 2, startRowHeader + 16, 'center')

  // body

  // info bill
  doc.setFontSize(14)
  doc.setFontStyle('bold')
  doc.text(changeAlias('HOÁ ĐƠN THANH TOÁN'), width / 2, startRowBody, 'center')

  doc.setFontSize(10)
  doc.setFontStyle('normal')
  doc.text(changeAlias(`Ngày: ${moment().format('DD/MM/YYYY')}`), 30, startRowBody + 10)
  doc.text(changeAlias(`Số: ...`), 90, startRowBody + 10)
  doc.text(changeAlias(`Thu ngân: ${bill.createdBy.username}`), 30, startRowBody + 15)
  doc.text(changeAlias(`In lúc: ${moment().format('HH:mm')}`), 90, startRowBody + 15)
  doc.text(changeAlias(`Giờ vào: ${moment(Math.min.apply(Math, roomDetails.map(o => o.startTime))).format('DD/MM/YYYY HH:mm')}`),
    30, startRowBody + 20)
  doc.text(changeAlias(`Giờ ra: ${moment(Math.max.apply(Math, roomDetails.map(o => o.endTime))).format('DD/MM/YYYY HH:mm')}`),
    90, startRowBody + 20)

  // room
  doc.setFontSize(10)
  doc.setFontStyle('bold')
  doc.text(changeAlias('Dịch vụ phòng:'), 10, startRowBody + 30)

  doc.autoTable({
    head: [roomTableHeaders],
    body: roomDetails.map(item => [
      moment(item.startTime).format('HH:mm'),
      moment(item.endTime).format('HH:mm'),
      changeAlias(item.room.name),
      getDiffMoment(item.startTime, item.endTime),
      item.room.typeRoom.unitPrice,
      item.total
    ]),
    startY: startRowBody + 33,
    styles: { fontSize: 10 },
    theme: 'plain',
    headStyles: { fillColor: '#FAFAFA' },
    margin: { left: 10, right: 10 },
    columnStyles: { 5: { cellWidth: 30 } }
  })

  // service per hour
  if (servicePerHourDetails.length > 0) {
    doc.setFontSize(10)
    doc.setFontStyle('bold')
    doc.text(changeAlias('Dịch vụ theo giờ:'), 10, startRowBody + 30 + (roomDetails.length + 2) * 8)

    doc.autoTable({
      head: [servicePerHourTableHeaders],
      body: servicePerHourDetails.map(item => [
        moment(item.startTime).format('HH:mm'),
        moment(item.endTime).format('HH:mm'),
        changeAlias(item.service.name),
        getDiffMoment(item.startTime, item.endTime),
        item.service.unitPrice,
        item.total
      ]),
      startY: startRowBody + 33 + (roomDetails.length + 2) * 8,
      styles: { fontSize: 10 },
      theme: 'plain',
      headStyles: { fillColor: '#FAFAFA' },
      margin: { left: 10, right: 10 },
      columnStyles: { 5: { cellWidth: 30 } }
    })
  }

  // service per unit
  if (servicePerUnitDetails.length > 0) {
    doc.setFontSize(10)
    doc.setFontStyle('bold')
    doc.text(changeAlias('Dịch vụ theo lượt:'), 10, startRowBody + 30 + (roomDetails.length + 2) * 8
      + (servicePerHourDetails.length > 0 ? (servicePerHourDetails.length + 2) * 8 : 0))

    doc.autoTable({
      head: [servicePerUnitTableHeaders],
      body: servicePerUnitDetails.map(item => [
        changeAlias(item.service.name),
        item.quantity,
        item.service.unitPrice,
        item.total
      ]),
      startY: startRowBody + 33 + (roomDetails.length + 2) * 8
        + (servicePerHourDetails.length > 0 ? (servicePerHourDetails.length + 2) * 8 : 0),
      styles: { fontSize: 10 },
      theme: 'plain',
      headStyles: { fillColor: '#FAFAFA' },
      margin: { left: 10, right: 10 },
      columnStyles: { 3: { cellWidth: 30 } }
    })
  }

  doc.setFontSize(10)
  doc.setFontStyle('normal')
  doc.text(changeAlias(`Khuyến mãi: ${discount ? discount.name : '-'}`), 30, startRowFooter - 10)
  doc.text(changeAlias(`${discount ? `${discount.value} ${discount.type}` : '-'}`), 90, startRowFooter - 5)
  // doc.text(changeAlias(`${bill.discount ? `${bill.discount.value} ${bill.discount.type}` : '-'}`, 90, startRowBody + 10))

  // footer
  doc.setFontSize(10)
  doc.setFontStyle('italic')
  // eslint-disable-next-line max-len
  doc.text('------------------------------------------------------------------------------------------------------------', width / 2, startRowFooter, 'center')

  doc.setFontSize(16)
  doc.setFontStyle('bold')
  doc.text(changeAlias('Tổng: '), 15, startRowFooter + 5, 'left')
  doc.text(changeAlias(`${bill.total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')), width - 15, startRowFooter + 5, 'right')

  doc.setFontSize(10)
  doc.setFontStyle('italic')
  doc.text(changeAlias('Cảm ơn Quý khách. Hẹn gặp lại!'), width / 2, startRowFooter + 12, 'center')


  // output
  doc.autoPrint()
  doc.output('dataurlnewwindow')
}
