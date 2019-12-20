import { Modal, Form, Table, Button } from 'antd'
import React from 'react'
import moment from 'moment'
import { FormatMoney } from 'helpers'

const ModalViewDiscount = Form.create()(props => {
  const { form, hide, visible, bill } = props

  const styles = {
    row: {
      // display: 'flex'
    },
    item: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px'
    },
    label: {
      fontWeight: '600'
    },
    value: {
      fontWeight: 'normal',
      marginLeft: '5px'
    },
    total: {
      fontSize: 18,
      fontWeight: 'bold'
    }
  }

  const columnRoomDefs = [
    {
      title: 'Giờ vào',
      dataIndex: 'startTime',
      key: 'startTime',
      render: data => moment(data).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Giờ ra',
      dataIndex: 'endTime',
      key: 'endTime',
      render: data => data ? moment(data).format('DD/MM/YYYY HH:mm') : '-'
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
      title: 'Thành tiền',
      dataIndex: 'total',
      key: 'total',
      render: data => data ? FormatMoney(data) : '-'
    }
  ]

  const columnServicePerHourDefs = [
    {
      title: 'Giờ vào',
      dataIndex: 'startTime',
      key: 'startTime',
      render: data => moment(data).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Giờ ra',
      dataIndex: 'endTime',
      key: 'endTime',
      render: data => data ? moment(data).format('DD/MM/YYYY HH:mm') : '-'
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
      render: data => FormatMoney(`${data}`)
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      key: 'total',
      render: data => data ? FormatMoney(Math.round(data)) : '-'
    }
  ]

  const columnServicePerUnitDefs = [
    {
      title: 'Dịch vụ',
      dataIndex: 'service.name',
      key: 'service.name'
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Đơn giá',
      dataIndex: 'service.unitPrice',
      key: 'service.unitPrice',
      render: data => FormatMoney(`${data}`)
    },

    {
      title: 'Thành tiền',
      dataIndex: 'total',
      key: 'total',
      render: data => data ? FormatMoney(`${data}`) : '-'
    }
  ]

  const { roomDetails } = bill
  const { servicePerHourDetails } = bill && bill.serviceDetails ? bill.serviceDetails.filter(obj => obj.service.type === 'perHOUR') : []
  const { servicePerUnitDetails } = bill && bill.serviceDetails ? bill.serviceDetails.filter(obj => obj.service.type === 'perUNIT') : []

  return (


    <Modal
      title='Bill Information'
      headerIcon='plus'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      width='700px'
      footer={[
        <Button type='primary' onClick={hide}>
          OK
        </Button>
      ]}
    >
      {bill ? (
        <div>
          <div style={styles.row}>
            <div style={styles.item}>
              <div style={styles.label}>ID: </div>
              <div style={styles.value}>{bill._id}</div>
            </div>
            <div style={styles.item}>
              <div style={styles.label}>Trạng thái: </div>
              <div style={styles.value}>{bill.state === 0 ? 'ĐÃ HUỶ' : (bill.state === 10 ? 'CHƯA HOÀN TẤT' : 'HOÀN TẤT')}</div>
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.item}>
              <div style={styles.label}>Ngày tạo: </div>
              <div style={styles.value}>{moment(bill.createdAt).format('DD/MM/YYYY HH:mm')}</div>
            </div>
            <div style={styles.item}>
              <div style={styles.label}>Người tạo: </div>
              <div style={styles.value}>{bill.createdBy.username}</div>
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.item}>
              <div style={styles.label}>Khách hàng: </div>
              <div style={styles.value}>{bill.customer ? bill.customer.name : '(Không)'}</div>
            </div>

            <div style={styles.item}>
              <div style={styles.label}>Tổng tiền: </div>
              <div style={styles.total}>
                {bill.state === 10 ? '-' : `${FormatMoney(bill.total)} VND`}
              </div>
            </div>
          </div>

          {roomDetails ? (
            <div style={{ marginTop: '10px' }}>
              <div style={styles.label}>Dịch vụ phòng: </div>
              <Table columns={columnRoomDefs} dataSource={roomDetails} pagination={false} />
            </div>
          ) : ''}

          {servicePerHourDetails ? (
            <div style={{ marginTop: '10px' }}>
              <div style={styles.label}>Dịch vụ theo giờ: </div>
              <Table columns={columnServicePerHourDefs} dataSource={servicePerHourDetails} pagination={false} />
            </div>
          ) : ''}

          {servicePerUnitDetails ? (
            <div style={{ marginTop: '10px' }}>
              <div style={styles.label}>Dịch vụ theo lượt: </div>
              <Table columns={columnServicePerUnitDefs} dataSource={servicePerUnitDetails} pagination={false} />
            </div>
          ) : ''}
        </div>
      ) : null}


    </Modal>
  )
})

export default ModalViewDiscount