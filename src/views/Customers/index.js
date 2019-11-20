import React, { useState, useEffect } from 'react'
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
    })
      .catch(err => new Notify('error', parseError(err)))
  }

  useEffect(() => {
    getCustomers()
  }, [])

  const columnDefs = [
    {
      headerName: 'Full name', field: 'name', sortable: true
    },
    {
      headerName: 'Phone Number', field: 'phone', sortable: true
    },
    {
      headerName: 'Email', field: 'email', sortable: true
    },
    {
      headerName: 'Points', field: 'points', sortable: true
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
          {/* <Icon
            style={{ cursor: 'pointer', margin: '5px' }}
            onClick={async () => {
              confirm({
                title: 'Do you Want to delete this user?',
                okType: 'danger',
                content: `- ${row.data.name}(${row.data.username})`,
                onOk: async () => {
                  await client.mutate({
                    mutation: DELETE_CUSTOMER,
                    variables: {
                      userId: row.data._id
                    }
                  }).then(async res => {
                    if (!res || !res.data || !res.data.deleteUser) {
                      throw Error('Có lỗi xẩy ra!')
                    }
                    await getCustomers()
                    return new Notify('success', 'Xóa user thành công!')
                  })
                    .catch(err => new Notify('error', parseError(err)))
                }
              })
            }}
            type='delete'
          /> */}
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
        Customers List
      </h2>

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
              Add Customer
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