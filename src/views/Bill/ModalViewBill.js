import { Modal, Form } from 'antd'
import React from 'react'
import moment from 'moment'
import { AgGridReact } from 'ag-grid-react'
import { Grid } from '@material-ui/core'
import './style.less'
import { GET_BILL } from './query'

const ModalViewDiscount = Form.create()(props => {
  const { form, hide, visible, refetch, bill } = props

  const styles = {
    item: {
      margin: '10px'
    },
    label: {
      fontWeight: '600'
    },
    value: {
      fontWeight: 'normal'
    },
    groupValue: {
      fontWeight: 'normal',
      marginLeft: '10px'
    },
    aggridTable: {
      height: 'calc(100vh - 250px)',
      width: '100%'
    },
    table: {
      overflow: 'auto'
    }
  }

  const columnRoomDefs = [
    {
      headerName: 'Giờ vào',
      field: 'startTime',
      resizable: true,
      cellRendererFramework: row => moment(row.value).format('DD/MM/YYYY HH:mm')
    },
    {
      headerName: 'Giờ ra',
      field: 'endTime',
      resizable: true,
      cellRendererFramework: row => moment(row.value).format('DD/MM/YYYY HH:mm')
    },
    {
      headerName: 'Phòng',
      field: 'room.name',
      resizable: true
    },
    {
      headerName: 'Loại phòng',
      field: 'room.typeRoom.name',
      resizable: true
    },
    {
      headerName: 'Đơn giá',
      field: 'room.typeRoom.unitPrice',
      resizable: true
    },
    {
      headerName: 'Thành tiền',
      field: 'total',
      resizable: true
    }
  ]

  const columnServicePerHourDefs = [
    {
      headerName: 'Giờ vào',
      field: 'startTime',
      resizable: true,
      cellRendererFramework: row => moment(row.value).format('DD/MM/YYYY HH:mm')
    },
    {
      headerName: 'Giờ ra',
      field: 'endTime',
      resizable: true,
      cellRendererFramework: row => moment(row.value).format('DD/MM/YYYY HH:mm')
    },
    {
      headerName: 'Dịch vụ',
      field: 'service.name',
      resizable: true
    },
    {
      headerName: 'Đơn giá',
      field: 'service.unitPrice',
      resizable: true
    },
    {
      headerName: 'Thành tiền',
      field: 'total',
      resizable: true
    }
  ]

  const columnServicePerUnitDefs = [
    {
      headerName: 'Dịch vụ',
      field: 'service.name',
      resizable: true
    },
    {
      headerName: 'Đơn giá',
      field: 'service.unitPrice',
      resizable: true
    },
    {
      headerName: 'Số lượng',
      field: 'quantity',
      resizable: true
    },
    {
      headerName: 'Thành tiền',
      field: 'total',
      resizable: true
    }
  ]

  const onGridReady = params => {
    params.api.sizeColumnsToFit()
  }

  return (
    <Modal
      title='Bill Information'
      headerIcon='plus'
      onCancel={hide}
      visible={visible}
      fieldsError={form.getFieldsError()}
      width='600px'
    >
      {bill ? (
        <div>
          <div style={styles.item}> 
            <div style={styles.label}>ID: </div>
            <div style={styles.value}>{bill._id}</div>
          </div>
          <div style={styles.item}> 
            <div style={styles.label}>Ngày tạo: </div>
            <div style={styles.value}>{moment(bill.createdAt).format('DD/MM/YYYY HH:mm')}</div>
          </div>
          <div style={styles.item}> 
            <div style={styles.label}>Người tạo: </div>
            <div style={styles.value}>{bill.createdBy.username}</div>
          </div>
          <div style={styles.item}> 
            <div style={styles.label}>Khách hàng: </div>
            <div style={styles.value}>{(bill.customer ? bill.customer.name : '(Không)')}</div>
          </div>
          <div style={styles.item}> 
            <div style={styles.label}>Trạng thái: </div>
            <div style={styles.value}>{bill.state}</div>
          </div>
          <div style={styles.item}> 
            <div style={styles.label}>Tổng tiền: </div>
            <div style={styles.value}>{`${bill.total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
          </div>

          <div style={styles.item}> 
            <div style={styles.label}>Dịch vụ phòng: </div>
            <Grid container direction='row' justify='center' alignItems='center'>
              <div style={styles.aggridTable}>
                <AgGridReact
                  style={styles.table}
                  columnDefs={columnRoomDefs}
                  rowData={bill.roomDetails}
                  onGridReady={onGridReady}
                />
              </div>
            </Grid>
          </div>

          <div style={styles.item}> 
            <div style={styles.label}>Dịch vụ theo giờ: </div>
            <Grid container direction='row' justify='center' alignItems='center'>
              <div style={styles.aggridTable}>
                <AgGridReact
                  style={styles.table}
                  columnDefs={columnServicePerHourDefs}
                  rowData={bill.serviceDetails.filter(x => x.service.type === 'perHOUR')}
                  onGridReady={onGridReady}
                />
              </div>
            </Grid>
          </div>

          <div style={styles.item}> 
            <div style={styles.label}>Dịch vụ theo lượt: </div>
            <Grid container direction='row' justify='center' alignItems='center'>
              <div style={styles.aggridTable}>
                <AgGridReact
                  style={styles.table}
                  columnDefs={columnServicePerUnitDefs}
                  rowData={bill.serviceDetails.filter(x => x.service.type === 'perUNIT')}
                  onGridReady={onGridReady}
                />
              </div>
            </Grid>
          </div>
        </div>
      ) : null }
      
      
    </Modal>
  )
})

export default ModalViewDiscount