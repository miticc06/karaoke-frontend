import React, { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import SearchIcon from '@material-ui/icons/Search'
import TextField from '@material-ui/core/TextField'
import { client } from 'config/client'
import { Notify } from 'helpers/notify'
import { parseError } from 'helpers'
import { Grid } from '@material-ui/core'
import { Icon, Button, Modal } from 'antd'
import { GET_USERS, GET_USER, DELETE_USER } from './query'
import './style.less'
import ModalAddUser from './ModalAddUser'
import ModalEditUser from './ModalEditUser'

const { confirm } = Modal

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [usersList, setUsersList] = useState([])
  const [visibleAdd, setVisibleAdd] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [userEdit, setUserEdit] = useState(null)

  const getUsers = async () => {
    await client.query({
      query: GET_USERS
    }).then(res => {
      if (!res || !res.data || !res.data.users) {
        throw new Error('Có lỗi xảy ra!')
      }
      setUsers(res.data.users)
      setUsersList(res.data.users)
    })
      .catch(err => new Notify('error', parseError(err)))
  }

  useEffect(() => {
    getUsers()
  }, [])

  const setTextValue = event => {
    let kw = event.target.value
    kw = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    if (kw !== '') {
      setUsers(usersList.filter(user => ( 
          user.username.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(kw) 
      || (user.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(kw)))))
    } else setUsers(usersList)
  }

  const columnDefs = [
    {
      headerName: 'Tên tài khoản', field: 'username', sortable: true
    },
    {
      headerName: 'Tên người dùng', field: 'name', sortable: true
    },
    {
      headerName: 'Email', field: 'email', sortable: true
    },
    {
      headerName: 'Phân quyền', field: 'role.name', sortable: true
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
                query: GET_USER,
                variables: {
                  id: row.data._id
                }
              })
                .then(res => {
                  if (!res || !res.data || !res.data.user) {
                    throw new Error('Có lỗi xảy ra!')
                  }
                  setUserEdit(res.data.user)
                })
                .catch(err => new Notify('error', parseError(err)))
            }}
            type='edit'
          />
          <Icon
            style={{ cursor: 'pointer', margin: '5px' }}
            onClick={async () => {
              confirm({
                title: 'Xác nhận xoá người dùng?',
                okType: 'danger',
                content: `- username: ${row.data.name}, fullname: ${row.data.username}`,
                onOk: async () => {
                  await client.mutate({
                    mutation: DELETE_USER,
                    variables: {
                      userId: row.data._id
                    }
                  }).then(async res => {
                    if (!res || !res.data || !res.data.deleteUser) {
                      throw Error('Có lỗi xẩy ra!')
                    }
                    await getUsers()
                    return new Notify('success', 'Xóa người dùng thành công!')
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
        QUẢN LÝ NGƯỜI DÙNG
      </h2>

      <form className='margin'>
        <Grid container spacing={1} alignItems='flex-end'>
          <Grid item>
            <SearchIcon />
          </Grid>
          <Grid item>
            <TextField
              id='input-with-icon-grid'
              label='Tìm kiếm người dùng...'
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

      <ModalEditUser
        user={userEdit}
        visible={visibleEdit}
        hide={() => setVisibleEdit(false)}
        refetch={getUsers}
      />
    </div>

  )
}

export default UserManagement