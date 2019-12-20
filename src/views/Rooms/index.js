
/* eslint-disable arrow-body-style */

/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable brace-style */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-multiple-empty-lines */
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import SearchIcon from '@material-ui/icons/Search'
import TextField from '@material-ui/core/TextField'
import { AgGridReact } from 'ag-grid-react'
import { client } from 'config/client'
import { Notify } from 'helpers/notify'
import { parseError, FormatMoney } from 'helpers'
import { Grid } from '@material-ui/core'
import { Icon, Button, Modal } from 'antd'
import { GET_ROOMS, GET_ROOM, DELETE_ROOM } from './query'
import './style.less'

import ModalAddRoom from './ModalAddRoom'
import ModalEditRoom from './ModalEditRoom'

const { confirm } = Modal

const RoomManagement = () => {
  const [rooms, setRooms] = useState([])
  const [roomsList, setRoomsList] = useState([])
  const [visibleAdd, setVisibleAdd] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [roomEdit, setRoomEdit] = useState(null)

  const getRooms = async () => {
    await client
      .query({
        query: GET_ROOMS
      })
      .then(res => {
        if (!res || !res.data || !res.data.rooms) {
          throw new Error('Có lỗi xảy ra!')
        }
        res.data.rooms.forEach(element => {
          element.createdAt = moment(element.createdAt).format('DD/MM/YYYY')
        })
        setRooms(res.data.rooms)
        setRoomsList(res.data.rooms)
      })
      .catch(err => new Notify('error', parseError(err)))
  }

  useEffect(() => {
    getRooms()
  }, [])

  const setTextValue = event => {
    let kw = event.target.value
    kw = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    if (kw !== '') {
      setRooms(roomsList.filter(room =>
        room.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(kw)))
    }
    else setRooms(roomsList)
  }

  const columnDefs = [
    {
      headerName: 'Tên phòng',
      field: 'name',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true
    },
    {
      headerName: 'Ngày tạo',
      field: 'createdAt',
      resizable: true,
      sortable: true
    },
    {
      headerName: 'Loại phòng',
      field: 'typeRoom.name',
      filter: 'agTextColumnFilter',
      resizable: true,
      sortable: true
    },
    {
      headerName: 'Đơn giá theo giờ',
      field: 'typeRoom.unitPrice',
      resizable: true,
      sortable: true,
      cellRendererFramework: data => `${FormatMoney(`${data.value}`)} VND`
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
              setVisibleEdit(true)
              client
                .query({
                  query: GET_ROOM,
                  variables: {
                    roomId: row.data._id
                  }
                })
                .then(res => {
                  if (!res || !res.data || !res.data.room) {
                    throw new Error('Có lỗi xảy ra!')
                  }
                  setRoomEdit(res.data.room)
                })
                .catch(err => new Notify('error', parseError(err)))
            }}
            type='edit'
          />
          <Icon
            style={{ cursor: 'pointer', margin: '5px' }}
            onClick={async () => {
              confirm({
                title: 'Xác nhận xoá phòng hát?',
                okType: 'danger',
                content: `- ${row.data.name} `,
                onOk: async () => {
                  await client
                    .mutate({
                      mutation: DELETE_ROOM,
                      variables: {
                        roomId: row.data._id
                      }
                    })
                    .then(async res => {
                      if (!res || !res.data || !res.data.deleteRoom) {
                        throw Error('Có lỗi xảy ra!')
                      }
                      await getRooms()
                      return new Notify('success', 'Xoá phòng hát thành công!')
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
    <div className='page-discountManagement'>
      <h2 className='title-page'>QUẢN LÝ PHÒNG HÁT</h2>

      <form className='margin'>
        <Grid container spacing={1} alignItems='flex-end'>
          <Grid item>
            <SearchIcon />
          </Grid>
          <Grid item>
            <TextField
              id='input-with-icon-grid'
              label='Tìm kiếm tên phòng hát...'
              onChange={setTextValue}
            />
          </Grid>
        </Grid>
      </form>

      <Button
        type='primary'
        icon='plus'
        name='btn-add-discount'
        onClick={() => setVisibleAdd(true)}
      >
        Thêm mới
      </Button>

      <Grid container direction='row' justify='center' alignItems='center'>
        <div className='ag-theme-material' id='aggrid-discounts'>
          <AgGridReact
            className='discountGrid'
            columnDefs={columnDefs}
            rowData={rooms}
            onGridReady={onGridReady}
          />
        </div>
      </Grid>

      <ModalAddRoom
        visible={visibleAdd}
        hide={() => setVisibleAdd(false)}
        refetch={getRooms}
      />

      <ModalEditRoom
        room={roomEdit}
        visible={visibleEdit}
        hide={() => setVisibleEdit(false)}
        refetch={getRooms}
      />
    </div>
  )
}

export default RoomManagement
