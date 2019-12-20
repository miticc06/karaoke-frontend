import React, { useState, useEffect } from 'react'
import moment from 'moment'
import SearchIcon from '@material-ui/icons/Search'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import { AgGridReact } from 'ag-grid-react'
import { client } from 'config/client'
import { Notify } from 'helpers/notify'
import { parseError } from 'helpers'
import { Grid } from '@material-ui/core'
import { Icon, Button, Modal } from 'antd'
import { GET_BILLS, GET_BILL, UPDATE_BILL, DELETE_BILL } from './query'
import './style.less'

import ModalViewBill from './ModalViewBill'

const { confirm } = Modal

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
        setBillsList(res.data.billsList)
      })
      .catch(err => new Notify('error', parseError(err)))
  }

  useEffect(() => {
    getBills()
  }, [])

  const setTextValue = event => {
    let kw = event.target.value
    kw = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    if (kw !== '') {
      setBillsList(billsList.filter(bill => bill.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(kw)))
    } else setBills(billsList)
  }

  const columnDefs = [
    {
      headerName: 'Created At',
      filter: 'agTextColumnFilter',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      cellRendererFramework: row => moment(row.value).format('DD/MM/YYYY HH:mm')
    },
    {
      headerName: 'Created By',
      field: 'createdBy.username',
      filter: 'agTextColumnFilter',
      resizable: true,
      sortable: true
    },
    {
      headerName: 'Customer',
      field: 'customer.name',
      resizable: true,
      sortable: true
    },
    {
      headerName: 'State',
      field: 'state',
      filter: 'agTextColumnFilter',
      resizable: true,
      sortable: true
    },
    {
      headerName: 'Total',
      field: 'total',
      filter: 'agTextColumnFilter',
      resizable: true,
      sortable: true
    },
    {
      headerName: 'Action',
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
                    throw new Error('Something went wrong!')
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
                title: 'Do you Want to delete this bill?',
                okType: 'danger',
                // content: `- "${row.data.name}" from ${row.data.startDate} to ${row.data.endDate}`,
                onOk: async () => {
                  await client
                    .mutate({
                      mutation: DELETE_BILL,
                      variables: {
                        billId: row.data._id
                      }
                    })
                    .then(async res => {
                      if (!res || !res.data || !res.data.deleteDiscount) {
                        throw Error('Something went wrong!')
                      }
                      await getBills()
                      return new Notify('success', 'Delete bill successfully!')
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
      <h2 className='title-page'>Bill Management</h2>

      <form className='margin'>
        <Grid container spacing={1} alignItems='flex-end'>
          <Grid item>
            <SearchIcon />
          </Grid>
          <Grid item>
            <TextField
              id='input-with-icon-grid'
              label='Search Bill'
              onChange={setTextValue}
            />
          </Grid>
        </Grid>
      </form>

      <Grid container direction='row' justify='center' alignItems='center'>
        <div className='ag-theme-material' id='aggrid-bills'>
          <AgGridReact
            className='billGrid'
            columnDefs={columnDefs}
            rowData={bills}
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
