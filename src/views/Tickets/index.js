/* eslint-disable func-names */
import React, { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
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

  const statusOptions = [
    { label: 'Mới', value: 'OPEN' },
    { label: 'Đang xử lý', value: 'IN_PROGRESS' },
    { label: 'Đã xong', value: 'SOLVED' },
    { label: 'Đã đóng', value: 'CLOSED' }
  ]

  const columnDefs = [
    {
      headerName: 'Status',
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
      headerName: 'Subject', field: 'subject', sortable: true
    },
    {
      headerName: 'Room', field: 'room.name', sortable: true
    },
    {
      headerName: 'Created By', field: 'createdBy.name', sortable: true
    },
    {
      headerName: 'Created At',
      field: 'createdAt',
      sortable: true,
      cellRenderer: (data) => data.value ? moment(data.value).format('HH:mm:ss - DD/MM/YYYY') : ''
    },
    {
      headerName: 'Action',
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
                title: 'Bạn có muốn xoá ticket?',
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
                    return new Notify('success', 'Xóa ticket thành công!')
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
        Tickets Management
      </h2>

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
              Add Ticket
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
