import React, { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { client } from 'config/client'
import { Notify } from 'helpers/notify'
import { parseError } from 'helpers'
import { Grid } from '@material-ui/core'
import { Icon, Button, Modal } from 'antd'
import { GET_PAYMENTSLIPS, GET_PAYMENTSLIP, DELETE_PAYMENTSLIP } from './query'
import './style.less'
import ModalAddPaymentSlip from './ModalAddPaymentSlip'
import ModalEditPaymentSlip from './ModalEditPaymentSlip'

const { confirm } = Modal

const PaymentSlipManagement = () => {
  const [paymentSlips, setPaymentSlips] = useState([])
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
    })
      .catch(err => new Notify('error', parseError(err)))
  }

  useEffect(() => {
    getPaymentSlips()
  }, [])

  const columnDefs = [
    {
      headerName: 'Description', field: 'description', sortable: true
    },
    {
      headerName: 'Price', field: 'price', sortable: true
    },
    {
      headerName: 'Created By', field: 'createdBy.name', sortable: true
    },
    {
      headerName: 'Created At', 
      field: 'createdAt', 
      sortable: true,
      cellRenderer: (data) => data.value ? (new Date(data.value)).toLocaleDateString() : ''
    },
    {
      headerName: 'Action',
      minWidth: 50,
      width: 50,
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
                title: 'Bạn có muốn xoá payment-slip?',
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
                    return new Notify('success', 'Xóa payment-slip thành công!')
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
        Payment Slips Management
      </h2>

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
              Add Payment Slip
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
