/* eslint-disable func-names */
import React, { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import SearchIcon from '@material-ui/icons/Search'
import TextField from '@material-ui/core/TextField'
import { client } from 'config/client'
import { Notify } from 'helpers/notify'
import { parseError } from 'helpers'
import { Grid } from '@material-ui/core'
import { Icon, Button, Modal } from 'antd'
import moment from 'moment'
import { GET_TICKETS, GET_TICKET, DELETE_TICKET, GET_ROOMS } from './query'
import './style.less'
import ModalAddTicket from './ModalAddTicket'
import ModalEditTicket from './ModalEditTicket'

const { confirm } = Modal

const TicketManagement = () => {
  const [rooms, setRooms] = useState([])
  const [tickets, setTickets] = useState([])
  const [ticketsList, setTicketsList] = useState([])
  const [visibleAdd, setVisibleAdd] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [ticketEdit, setTicketEdit] = useState(null)

  const getTickets = async () => {
    await client.query({
      query: GET_TICKETS
    }).then(res => {
      if (!res || !res.data || !res.data.tickets) {
        throw new Error('Có lỗi xảy ra!')
      }
      setTickets(res.data.tickets)
      setTicketsList(res.data.tickets)
    })
      .catch(err => new Notify('error', parseError(err)))
  }

  const getRooms = async () => {
    await client.query({
      query: GET_ROOMS
    }).then(res => {
      if (!res || !res.data || !res.data.rooms) {
        throw new Error('getRooms: Có lỗi xảy ra!')
      }
      setRooms(res.data.rooms)
    })
      .catch(err => new Notify('error', parseError(err)))
  }

  useEffect(() => {
    getTickets()
    getRooms()
  }, [])

  const setTextValue = event => {
    let kw = event.target.value
    kw = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    if (kw !== '') {
      setTickets(ticketsList.filter(ticket => ticket.subject.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(kw))) 
    } else setTickets(ticketsList)
  }

  const statusOptions = [
    { label: 'Mới', value: 'OPEN' },
    { label: 'Đang xử lý', value: 'IN_PROGRESS' },
    { label: 'Đã xong', value: 'SOLVED' },
    { label: 'Đã đóng', value: 'CLOSED' }
  ]

  const columnDefs = [
    {
      headerName: 'Trạng thái',
      field: 'status',
      sortable: true,
      minWidth: 50,
      width: 100,
      maxWidth: 150,
      cellClassRules: {
        // 'status status-new': function (params) { return params.value === 'NEW' },
        'status status-open': function (params) { return params.value === 'OPEN' },
        // 'status status-on-hold': function (params) { return params.value === 'ON_HOLD' },
        // 'status status-pending': function (params) { return params.value === 'PENDING' },
        'status status-in-progress': function (params) { return params.value === 'IN_PROGRESS' },
        'status status-solved': function (params) { return params.value === 'SOLVED' },
        'status status-closed': function (params) { return params.value === 'CLOSED' }
      }
    },
    {
      headerName: 'Tiêu đề', field: 'subject', sortable: true
    },
    {
      headerName: 'Phòng', field: 'room.name', sortable: true
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
      width: 100,
      maxWidth: 100,
      suppressMenu: true,
      cellRendererFramework: row => (
        <>
          <Icon
            style={{ cursor: 'pointer', margin: '5px' }}
            onClick={async (e) => {
              setVisibleEdit(true)
              client.query({
                query: GET_TICKET,
                variables: {
                  ticketId: row.data._id
                }
              })
                .then(res => {
                  if (!res || !res.data || !res.data.ticket) {
                    throw new Error('Có lỗi xảy ra!')
                  }
                  setTicketEdit(res.data.ticket)
                })
                .catch(err => new Notify('error', parseError(err)))
            }}
            type='edit'
          />
          <Icon
            style={{ cursor: 'pointer', margin: '5px' }}
            onClick={async () => {
              confirm({
                title: 'Xác nhận xoá yêu cầu hỗ trợ?',
                okType: 'danger',
                content: `- ${row.data.subject}`,
                onOk: async () => {
                  await client.mutate({
                    mutation: DELETE_TICKET,
                    variables: {
                      ticketId: row.data._id
                    }
                  }).then(async res => {
                    if (!res || !res.data || !res.data.deleteTicket) {
                      throw Error('Có lỗi xảy ra!')
                    }
                    await getTickets()
                    return new Notify('success', 'Xóa yêu cầu hỗ trợ thành công!')
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
    <div className='page-ticketManagement'>
      <h2 className='title-page'>
        QUẢN LÝ YÊU CẦU
      </h2>

      <form className='margin'>
        <Grid container spacing={1} alignItems='flex-end'>
          <Grid item>
            <SearchIcon />
          </Grid>
          <Grid item>
            <TextField
              id='input-with-icon-grid'
              label='Tìm kiếm tên yêu cầu...'
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
          id='aggrid-tickets'
        >
          <Grid container justify='flex-end'>
            <Button
              type='primary'
              icon='plus'
              name='btn-add-ticket'
              onClick={() => setVisibleAdd(true)}
            >
              Thêm mới
            </Button>
          </Grid>

          <AgGridReact
            columnDefs={columnDefs}
            rowData={tickets}
            onGridReady={onGridReady}
          />


        </div>
      </Grid>

      <ModalAddTicket
        rooms={rooms}
        statusOptions={statusOptions}
        visible={visibleAdd}
        hide={() => setVisibleAdd(false)}
        refetch={getTickets}
      />

      <ModalEditTicket
        ticket={ticketEdit}
        rooms={rooms}
        statusOptions={statusOptions}
        visible={visibleEdit}
        hide={() => setVisibleEdit(false)}
        refetch={getTickets}
      />
    </div>

  )
}

export default TicketManagement
