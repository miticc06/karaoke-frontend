import SearchIcon from '@material-ui/icons/Search'
import TextField from '@material-ui/core/TextField'
import React, { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { client } from 'config/client'
import { Notify } from 'helpers/notify'
import { parseError, FormatMoney } from 'helpers'
import { Grid } from '@material-ui/core'
import { Icon, Button, Modal } from 'antd'
import moment from 'moment'
import { GET_PAYMENTSLIPS, GET_PAYMENTSLIP, DELETE_PAYMENTSLIP } from './query'
import './style.less'
import ModalAddPaymentSlip from './ModalAddPaymentSlip'
import ModalEditPaymentSlip from './ModalEditPaymentSlip'


const { confirm } = Modal

const PaymentSlipManagement = () => {
  const [paymentSlips, setPaymentSlips] = useState([])
  const [paymentSlipsList, setPaymentSlipsList] = useState([])
  const [visibleAdd, setVisibleAdd] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [paymentSlipEdit, setPaymentSlipEdit] = useState(null)

  const getPaymentSlips = async () => {
    await client.query({
      query: GET_PAYMENTSLIPS
    }).then(res => {
      if (!res || !res.data || !res.data.paymentSlips) {
        throw new Error('Có lỗi xảy ra!')
      }
      setPaymentSlips(res.data.paymentSlips)
      setPaymentSlipsList(res.data.paymentSlips)
    })
      .catch(err => new Notify('error', parseError(err)))
  }

  useEffect(() => {
    getPaymentSlips()
  }, [])

  const setTextValue = (event) => {
    let kw = event.target.value
    kw = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    console.log(kw)
    if (kw !== '') {
      // eslint-disable-next-line max-len
      setPaymentSlips(paymentSlipsList.filter(payment => payment.description.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(kw)))
    } else setPaymentSlips(paymentSlipsList)
  }

  const columnDefs = [
    {
      headerName: 'Tên phiếu chi', field: 'description', sortable: true
    },
    {
      headerName: 'Giá tiền', 
      field: 'price', 
      sortable: true, 
      cellRenderer: (data) => FormatMoney(`${data.value}`)
    },
    {
      headerName: 'Người tạo', field: 'createdBy.name', sortable: true
    },
    {
      headerName: 'Ngày tạo', 
      field: 'createdAt', 
      sortable: true,
      cellRenderer: (data) => data.value ? moment(data.value).format('DD/MM/YYYY HH:mm') : ''
    },
    {
      headerName: 'Thao tác',
      minWidth: 50,
      width: 70,
      maxWidth: 100,
      suppressMenu: true,
      cellRendererFramework: row => (
        <>
          <Icon
            style={{ cursor: 'pointer', margin: '5px' }}
            onClick={async (e) => {
              setVisibleEdit(true)
              client.query({
                query: GET_PAYMENTSLIP,
                variables: {
                  paymentSlipId: row.data._id
                }
              })
                .then(res => {
                  if (!res || !res.data || !res.data.paymentSlip) {
                    throw new Error('Có lỗi xảy ra!')
                  }
                  setPaymentSlipEdit(res.data.paymentSlip)
                })
                .catch(err => new Notify('error', parseError(err)))
            }}
            type='edit'
          />
          <Icon
            style={{ cursor: 'pointer', margin: '5px' }}
            onClick={async () => {
              confirm({
                title: 'Xác nhận xoá phiếu chi?',
                okType: 'danger',
                content: `- ${row.data.description}`,
                onOk: async () => {
                  await client.mutate({
                    mutation: DELETE_PAYMENTSLIP,
                    variables: {
                      paymentSlipId: row.data._id
                    }
                  }).then(async res => {
                    if (!res || !res.data || !res.data.deletePaymentSlip) {
                      throw Error('Có lỗi xảy ra!')
                    }
                    await getPaymentSlips()
                    return new Notify('success', 'Xóa phiếu chi thành công!')
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
    <div className='page-paymentSlipsManagement'>
      <h2 className='title-page'>
        QUẢN LÝ PHIẾU CHI
      </h2>

      <form className='margin'>
        <Grid container spacing={1} alignItems='flex-end'>
          <Grid item>
            <SearchIcon />
          </Grid>
          <Grid item>
            <TextField
              id='input-with-icon-grid'
              label='Tìm kiếm tên phiếu chi...'
              onChange={setTextValue}
            />
          </Grid>
        </Grid>
      </form>

      <Grid
        container
        direction='row'
        justify='center'
        alignItems='center'
      >

        <div
          className='ag-theme-material'
          id='aggrid-paymentSlips'
        >
          <Grid container justify='flex-end'>
            <Button
              type='primary'
              icon='plus'
              name='btn-add-paymentSlip'
              onClick={() => setVisibleAdd(true)}
            >
              Thêm mới
            </Button>
          </Grid>

          <AgGridReact
            columnDefs={columnDefs}
            rowData={paymentSlips}
            onGridReady={onGridReady}
          />


        </div>
      </Grid>

      <ModalAddPaymentSlip
        visible={visibleAdd}
        hide={() => setVisibleAdd(false)}
        refetch={getPaymentSlips}
      />

      <ModalEditPaymentSlip
        paymentSlip={paymentSlipEdit}
        visible={visibleEdit}
        hide={() => setVisibleEdit(false)}
        refetch={getPaymentSlips}
      />
    </div>

  )
}

export default PaymentSlipManagement
