import React, { useState, useEffect } from 'react'
import SearchIcon from '@material-ui/icons/Search'
import TextField from '@material-ui/core/TextField'
import { AgGridReact } from 'ag-grid-react'
import { client } from 'config/client'
import { Notify } from 'helpers/notify'
import { parseError } from 'helpers'
import { Grid } from '@material-ui/core'
import { Icon, Button, Modal } from 'antd'
import { GET_CUSTOMERS, GET_CUSTOMER, DELETE_CUSTOMER } from './query'
import './style.less'


import ModalAddCustomer from './ModalAddCustomer'
import ModalEditCustomer from './ModalEditCustomer'

const { confirm } = Modal


const CustomerManagement = () => {
  const [customers, setCustomers] = useState([])
  const [customersList, setCustomersList] = useState([])
  const [visibleAdd, setVisibleAdd] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [customerEdit, setCustomerEdit] = useState(null)


  const getCustomers = async () => {
    await client.query({
      query: GET_CUSTOMERS
    }).then(res => {
      if (!res || !res.data || !res.data.customers) {
        throw new Error('Có lỗi xảy ra!')
      }
      setCustomers(res.data.customers)
      setCustomersList(res.data.customers)
    })
      .catch(err => new Notify('error', parseError(err)))
  }

  useEffect(() => {
    getCustomers()
  }, [])

  const setTextValue = (event) => {
    let kw = event.target.value
    kw = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    console.log(kw)
    if (kw !== '') {
      setCustomers(customersList.filter(customer => customer.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(kw)
        || customer.phone.includes(kw)
        || customer.email.includes(kw)))
    } else setCustomers(customersList)
  }

  const columnDefs = [
    {
      headerName: 'Họ và tên', field: 'name', sortable: true
    },
    {
      headerName: 'Số điện thoại', field: 'phone', sortable: true
    },
    {
      headerName: 'Email', field: 'email', sortable: true
    },
    {
      headerName: 'Điểm tích luỹ', field: 'points', sortable: true
    },
    {
      headerName: 'Thao tác',
      minWidth: 50,
      maxWidth: 100,
      suppressMenu: true,
      cellRendererFramework: row => (
        <>
          <Icon
            style={{ cursor: 'pointer', margin: '5px' }}
            onClick={async (e) => {
              setVisibleEdit(true)
              client.query({
                query: GET_CUSTOMER,
                variables: {
                  id: row.data._id
                }
              })
                .then(res => {
                  if (!res || !res.data || !res.data.customer) {
                    throw new Error('Có lỗi xảy ra!')
                  }
                  setCustomerEdit(res.data.customer)
                })
                .catch(err => new Notify('error', parseError(err)))
            }}
            type='edit'
          />
          <Icon
            style={{ cursor: 'pointer', margin: '5px' }}
            onClick={async () => {
              confirm({
                title: 'Xác nhận xoá khách hàng?',
                okType: 'danger',
                content: `- Họ và tên: ${row.data.name} - Số điện thoại: ${row.data.phone}`,
                onOk: async () => {
                  await client.mutate({
                    mutation: DELETE_CUSTOMER,
                    variables: {
                      customerId: row.data._id
                    }
                  }).then(async res => {
                    if (!res || !res.data || !res.data.deleteCustomer) {
                      throw Error('Có lỗi xẩy ra!')
                    }
                    await getCustomers()
                    return new Notify('success', 'Xóa khách hàng thành công!')
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
    <div className='page-usersManagement'>
      <h2 className='title-page'>
        QUẢN LÝ KHÁCH HÀNG
      </h2>

      <form className='margin'>
        <Grid container spacing={1} alignItems='flex-end'>
          <Grid item>
            <SearchIcon />
          </Grid>
          <Grid item>
            <TextField
              id='input-with-icon-grid'
              label='Tìm kiếm tên khách hàng...'
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
          id='aggrid-users'
        >
          <Grid container justify='flex-end'>
            <Button
              type='primary'
              icon='plus'
              name='btn-add-user'
              onClick={() => setVisibleAdd(true)}
            >
              Thêm mới
            </Button>
          </Grid>

          <AgGridReact
            columnDefs={columnDefs}
            rowData={customers}
            onGridReady={onGridReady}
          />


        </div>
      </Grid>

      <ModalAddCustomer
        visible={visibleAdd}
        hide={() => setVisibleAdd(false)}
        refetch={getCustomers}
      />

      <ModalEditCustomer
        customer={customerEdit}
        visible={visibleEdit}
        hide={() => setVisibleEdit(false)}
        refetch={getCustomers}
      />
    </div>

  )
}

export default CustomerManagement