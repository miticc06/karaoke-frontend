import React, { useState, useEffect } from 'react'
import moment from 'moment'
import SearchIcon from '@material-ui/icons/Search'
import { AgGridReact } from 'ag-grid-react'
import { client } from 'config/client'
import { Notify } from 'helpers/notify'
import { parseError } from 'helpers'
import { Grid } from '@material-ui/core'
import { Icon, Modal, Select } from 'antd'
import { GET_BILLS, GET_BILL, DELETE_BILL } from './query'
import './style.less'

import ModalViewBill from './ModalViewBill'

const { confirm } = Modal
const { Option } = Select

const BillManagement = () => {
  const [bills, setBills] = useState([])
  const [billsList, setBillsList] = useState([])
  const [visibleView, setVisibleView] = useState(false)
  const [billView, setBillView] = useState('')

  const getBills = async () => {
    await client
      .query({
        query: GET_BILLS
      })
      .then(res => {
        if (!res || !res.data || !res.data.bills) {
          throw new Error('Có lỗi xảy ra!')
        }

        setBills(res.data.bills)
        setBillsList(res.data.bills)
      })
      .catch(err => new Notify('error', parseError(err)))
  }

  useEffect(() => {
    getBills()
  }, [])

  const states = [
    { key: '-1', label: 'Tất cả' },
    { key: '0', label: 'Đã huỷ' },
    { key: '10', label: 'Chưa hoàn thành' },
    { key: '20', label: 'Đã hoàn thành' }
  ]

  // const filterByCreatedBy = event => {
  //   let kw = event.target.value
  //   kw = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  //   let filterResult = (kw === '' 
  //             ? bills  
  //             : bills.filter(bill => (bill.createdBy.username).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(kw)))
  // }

  const filterState = event => {
    if (event === '-1') {
      setBillsList(bills)
    } else {
      setBillsList(bills.filter(bill => bill.state.toString() === event))
    }
  }

  const columnDefs = [
    {
      headerName: 'Ngày tạo',
      filter: 'agTextColumnFilter',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      cellRendererFramework: row => moment(row.value).format('DD/MM/YYYY HH:mm')
    },
    {
      headerName: 'Người tạo',
      field: 'createdBy.username',
      filter: 'agTextColumnFilter',
      resizable: true,
      sortable: true
    },
    {
      headerName: 'Khách hàng',
      field: 'customer.name',
      resizable: true,
      sortable: true,
      cellRendererFramework: row => (row.value ? `${row.value}` : '-')
    },
    {
      headerName: 'Trạng thái',
      field: 'state',
      filter: 'agTextColumnFilter',
      resizable: true,
      sortable: true,
      cellRendererFramework: row => (row.value === 0 ? 'Đã huỷ' : (row.value === 10 ? 'Chưa hoàn thành' : 'Đã hoàn thành'))
    },
    {
      headerName: 'Tổng tiền',
      field: 'total',
      filter: 'agTextColumnFilter',
      resizable: true,
      sortable: true,
      cellRendererFramework: row => (row.value ? `${(row.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : '-')
    },
    {
      headerName: 'Thao tác',
      minWidth: 50,
      width: 150,
      maxWidth: 100,
      suppressMenu: true,
      cellRendererFramework: row => (
        <>
          <Icon
            style={{ cursor: 'pointer', margin: '5px' }}
            onClick={async e => {
              setVisibleView(true)
              client
                .query({
                  query: GET_BILL,
                  variables: {
                    id: row.data._id
                  }
                })
                .then(res => {
                  if (!res || !res.data || !res.data.bill) {
                    throw new Error('Có lỗi xảy ra!')
                  }
                  setBillView(res.data.bill)
                })
                .catch(err => new Notify('error', parseError(err)))
            }}
            type='eye'
          />

          <Icon
            style={{ cursor: 'pointer', margin: '5px' }}
            onClick={async () => {
              confirm({
                title: 'Xác nhận xoá hoá đơn thanh toán?',
                okType: 'danger',
                content: `- ${moment(row.data.createdAt).format('DD/MM/YYYY HH:mm')} tạo bởi ${row.data.createdBy.username} -`,
                onOk: async () => {
                  await client
                    .mutate({
                      mutation: DELETE_BILL,
                      variables: {
                        billId: row.data._id
                      }
                    })
                    .then(async res => {
                      if (!res || !res.data || !res.data.deleteBill) {
                        throw Error('Có lỗi xảy ra!')
                      }
                      await getBills()
                      return new Notify('success', 'Xoá hoá đơn thành công!')
                    })
                    .catch(err => new Notify('error', parseError(err)))
                }
              })
            }}
            type='delete'
          />

        </>
      )
    }
  ]

  const onGridReady = params => {
    params.api.sizeColumnsToFit()
  }

  return (
    <div className='page-billManagement'>
      <h2 className='title-page'>QUẢN LÝ HOÁ ĐƠN THANH TOÁN</h2>

      <form className='margin'>
        <Grid container spacing={1} alignItems='flex-end'>
          <Grid item>
            <SearchIcon />
          </Grid>
          <Grid item>
            <Select defaultValue='-1' onSelect={(e) => filterState(e)} style={{ width: '200px' }}>
              {states.map(state => (
                <Option value={state.key}>
                  <div>{state.label}</div>
                </Option>
              ))}
            </Select>
          </Grid>
          {/* <Grid item>
            <TextField
              id='input-with-icon-grid'
              label='Người tạo...'
              onChange={(e) => setCreatedByFilter(e.target.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))}
              style={{ marginLeft: '15px', width: '200px' }}
            />
          </Grid> */}
        </Grid>
      </form>

      <Grid container direction='row' justify='center' alignItems='center'>
        <div className='ag-theme-material' id='aggrid-bills'>
          <AgGridReact
            className='billGrid'
            columnDefs={columnDefs}
            rowData={billsList}
            onGridReady={onGridReady}
          />
        </div>
      </Grid>

      <ModalViewBill
        bill={billView}
        visible={visibleView}
        hide={() => setVisibleView(false)}
        refetch={getBills}
      />
    </div>
  )
}

export default BillManagement
