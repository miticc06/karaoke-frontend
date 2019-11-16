import React, { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { client } from 'config/client'
import { Notify } from 'helpers/notify'
import { parseError } from 'helpers'
import { Grid } from '@material-ui/core'
import { Icon, Button } from 'antd'
import { GET_USERS } from './query'
import './style.less'
import ModalAddUser from './ModalAddUser'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [visibleAdd, setVisibleAdd] = useState(false)

  const getUsers = async () => {
    await client.query({
      query: GET_USERS
    }).then(res => {
      if (!res || !res.data || !res.data.users) {
        throw new Error('Có lỗi xảy ra!')
      }
      setUsers(res.data.users)
    })
      .catch(err => new Notify('error', parseError(err)))
  }

  useEffect(() => {
    getUsers()
  }, [])

  const columnDefs = [
    {
      headerName: 'Username', field: 'username', sortable: true
    },
    {
      headerName: 'Full name', field: 'name', sortable: true
    },
    {
      headerName: 'Email', field: 'email', sortable: true
    },
    {
      headerName: 'Role', field: 'role.name', sortable: true
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
            onClick={async () => {

            }}
            type='edit'
          />
          <Icon
            style={{ cursor: 'pointer', margin: '5px' }}
            onClick={async () => {

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
        Users management
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
              Add User
            </Button>
          </Grid>

          <AgGridReact
            columnDefs={columnDefs}
            rowData={users}
            onGridReady={onGridReady}
          />


        </div>
      </Grid>

      <ModalAddUser
        visible={visibleAdd}
        hide={() => setVisibleAdd(false)}
        refetch={getUsers}
      />
    </div>

  )
}

export default UserManagement