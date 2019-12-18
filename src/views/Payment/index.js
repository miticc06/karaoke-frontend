/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import './style.less'
import { Col, Row, Tabs, Button, Table, Icon, Tooltip, Modal } from 'antd'
import { client } from 'config/client'
import { Notify } from 'helpers/notify'
import { parseError } from 'helpers'
import moment from 'moment'
import { GET_ROOMS, GET_BILL_BY_ROOM_ID, CREATE_BILL, UPDATE_BILL, GET_SERVICES } from './query'
import { columnsRoomDetails, columnsServiceDetailsPerHOUR, columnsServiceDetailsPerUNIT } from './columnsTable'
import ModalAddTicket from '../Tickets/ModalAddTicket'

const { confirm } = Modal
const { TabPane } = Tabs

const Payment = props => {
  const [rooms, setRooms] = useState([])
  const [services, setServices] = useState([])
  const [roomSelected, setRoomSelected] = useState(null)
  const [bill, setBill] = useState(null)
  const [visibleAddTicket, setVisibleAddTicket] = useState(false)
  const [roomNeedAddTicket, setRoomNeedAddTicket] = useState(null)

  const getRooms = async () => {
    await client
      .query({
        query: GET_ROOMS
      })
      .then(res => {
        if (!res || !res.data || !res.data.rooms) {
          throw new Error('Có lỗi xảy ra!')
        }
        setRooms(res.data.rooms)
        if (!roomSelected) {
          console.log('roomSelected:  ', res.data.rooms[0])
          setRoomSelected(res.data.rooms[0])
        }
      })
      .catch(err => new Notify('error', parseError(err)))
  }

  const getServices = async () => {
    await client
      .query({
        query: GET_SERVICES
      })
      .then(res => {
        if (!res || !res.data || !res.data.services) {
          throw new Error('Có lỗi xảy ra!')
        }
        setServices(res.data.services)
      })
      .catch(err => new Notify('error', parseError(err)))
  }

  useEffect(() => {
    getRooms()
    getServices()
  }, [])

  const getBillByRoomId = async (roomId) => {
    await client
      .query({
        query: GET_BILL_BY_ROOM_ID,
        variables: {
          roomId
        }
      })
      .then(res => {
        if (!res || !res.data) {
          throw new Error('Có lỗi xảy ra!')
        }
        setBill(res.data.billByRoom)
      })
      .catch(err => new Notify('error', parseError(err)))
  }

  useEffect(() => {
    // getRooms()
    if (roomSelected) {
      getBillByRoomId(roomSelected._id)
    }
  }, [roomSelected])


  const handleSelectRoom = (roomId) => {
    const room = rooms.find(obj => obj._id === roomId)
    setRoomSelected(room)
  }

  const handleCheckInRoom = async () => {
    const submit = async () => {
      await client
        .mutate({
          mutation: CREATE_BILL,
          variables: {
            input: {
              roomDetails: [
                {
                  room: {
                    _id: roomSelected._id,
                    name: roomSelected.name,
                    typeRoom: roomSelected.typeRoom
                  },
                  startTime: +moment()
                }
              ],
              serviceDetails: []
            }
          }
        })
        .then(async res => {
          if (res && res.data && res.data.createBill) {
            // eslint-disable-next-line
            const notify = new Notify(
              'success',
              'Đã tiếp nhận',
              2
            )

            // refetch data
            await getRooms()
            await getBillByRoomId(roomSelected._id)
          }
        })
        .catch(err => {
          // eslint-disable-next-line
          const notify = new Notify('error', parseError(err), 3)
        })
    }

    if (roomSelected.tickets.length) {
      confirm({
        title: 'Thông báo',
        // eslint-disable-next-line max-len
        content: `Phòng đang yêu cầu hỗ trợ "${roomSelected.tickets.map(ticket => ticket.subject).join('; ')}". Bạn có chắc chắn muốn nhận khách không?`,
        onOk () {
          submit()
        },
        onCancel () { }
      })
    }
  }

  const handleUpdateBill = async (billId, input) => {
    delete input._id
    delete input.state
    delete input.total
    delete input.createdAt
    delete input.createdBy
    input.customer = input && input.customer ? input.customer._id : null
    await client
      .mutate({
        mutation: UPDATE_BILL,
        variables: {
          billId,
          input
        }
      })
      .then(async res => {
        if (res && res.data && res.data.updateBill) {
          console.log('done', res.data.updateBill)
          // refetch data
          await getRooms()
          await getBillByRoomId(roomSelected._id)
        }
      })
      .catch(err => {
        // eslint-disable-next-line
        const notify = new Notify('error', parseError(err), 3)
      })
  }

  const handleUpdateQuantityItem = async (serviceId, startTime, newQuantity) => {
    console.log(serviceId, newQuantity)
    const newBill = {
      ...bill
    }

    if (newQuantity <= 0) {
      const indexService = newBill.serviceDetails.findIndex(obj => obj.service._id === serviceId && startTime === obj.startTime)
      console.log(newBill.serviceDetails)
      console.log('find: indexService', indexService, newBill.serviceDetails[indexService])
      newBill.serviceDetails.splice(indexService, 1)
      // newBill.serviceDetails = newBill.serviceDetails.filter(obj => obj.service._id !== serviceId)
    } else {
      const findService = newBill.serviceDetails.find(obj => obj.service._id === serviceId && startTime === obj.startTime)
      findService.quantity = newQuantity
      console.log(findService)
    }
    await handleUpdateBill(bill._id, newBill)
  }


  const handleSelectService = async (serviceId) => {
    if (!bill) {
      return new Notify('error', 'Bạn chưa Check-In phòng!', 2)
    }
    const service = services.find(obj => obj._id === serviceId)
    console.log(service)

    if (service.type === 'perUNIT') {
      const findServiceExistInBill = bill.serviceDetails.find(obj => obj.service._id === serviceId)
      if (findServiceExistInBill) {
        await handleUpdateQuantityItem(serviceId, findServiceExistInBill.startTime, findServiceExistInBill.quantity + 1)
      } else {
        await handleUpdateBill(bill._id, {
          ...bill,
          serviceDetails: [...bill.serviceDetails, {
            service,
            startTime: +moment(),
            quantity: 1
          }]
        })
      }
    } else {
      console.log(service)
      await handleUpdateBill(bill._id, {
        ...bill,
        serviceDetails: [...bill.serviceDetails, {
          service,
          startTime: +moment(),
          quantity: 1
        }]
      })
    }
  }


  const servicesPerHour = bill && bill.serviceDetails ? bill.serviceDetails.filter(obj => obj.service.type === 'perHOUR') : []
  const servicesPerUnit = bill && bill.serviceDetails ? bill.serviceDetails.filter(obj => obj.service.type === 'perUNIT') : []

  return (
    <Row className='payment'>

      <ModalAddTicket
        roomNeedAddTicket={roomNeedAddTicket}
        rooms={rooms}
        statusOptions={[{ label: 'Mới', value: 'OPEN' }]}
        visible={visibleAddTicket}
        hide={() => setVisibleAddTicket(false)}
        refetch={async () => { await getRooms() }}
      />

      <Col
        xs={24}
        md={12}
      >
        <div className='left'>


          <Tabs
            className='tab-left'
            defaultActiveKey='1'
          >
            <TabPane
              tab='Phòng'
              key='1'
            >
              <div className='rooms'>
                {rooms.map(room => (
                  <div
                    key={room._id}
                    className={`room${roomSelected && roomSelected._id === room._id ? ' room-selected' : ''}`}
                    onClick={() => handleSelectRoom(room._id)}
                  >

                    <div className='room-top'>
                      {room.tickets.length === 0 && (
                        <Tooltip
                          placement='bottomLeft'
                          title='Bấm vào đây để báo hỏng!'
                          onClick={(e) => {
                            setVisibleAddTicket(true)
                            setRoomNeedAddTicket(room)
                          }}
                        >
                          <Icon
                            style={{ margin: '8px', color: '#a7a7a7' }}
                            type='warning'
                            theme='filled'
                          />
                        </Tooltip>
                      )}

                      {room.tickets.length > 0 && (
                        <Tooltip
                          placement='bottomLeft'
                          title={room.tickets.map(ticket => ticket.subject).join('; ')}
                          onClick={(e) => {
                            setVisibleAddTicket(true)
                            setRoomNeedAddTicket(room)
                          }}
                        >
                          <Icon
                            style={{ margin: '8px', color: '#ff444e' }}
                            type='warning'
                            theme='filled'
                          />
                        </Tooltip>
                      )}
                    </div>
                    <div className='room-center'>{room.name}</div>
                    <div className='room-bottom'>
                      <div className='room-status'>
                        {room.bill && (<div style={{ background: 'red', height: '11px', width: '11px', borderRadius: '50px', margin: '5px' }} />)}
                        {room.bill && 'Đang sử dụng'}
                        {!room.bill && (<div style={{ background: 'green', height: '11px', width: '11px', borderRadius: '50px', margin: '5px' }} />)}
                        {!room.bill && 'Còn phòng'}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </TabPane>
            <TabPane tab='Dịch vụ' key='2'>
              <div className='services'>
                {services.map(service => (
                  <div
                    key={service._id}
                    className='service'
                    onClick={() => handleSelectService(service._id)}
                  >
                    <div className='service-top' />
                    <div className='service-center'>
                      <div>{service.name}</div>
                      <div>
                        {service.unitPrice}
                        đ/
                        {service.type === 'perHOUR' ? 'giờ' : 'lượt'}
                      </div>
                    </div>
                    <div className='service-bottom' />
                  </div>
                ))}
              </div>
            </TabPane>
          </Tabs>


        </div>
      </Col>

      <Col
        xs={24}
        md={12}
      >
        <div className='right'>
          <div className='top-bill'>
            <div className='title-bill'>Hóa đơn dịch vụ</div>
            <div className='room-bill'>
              Phòng
              <div className='room-name'>{roomSelected && roomSelected.name}</div>
            </div>

            <div className='group-list-room-details'>
              <div className='title-list-room-details'>
                Dịch vụ phòng
              </div>
              <Table
                className='list-room-details'
                columns={columnsRoomDetails}
                dataSource={bill && bill.roomDetails}
                pagination={false}
              />
            </div>

            {servicesPerHour.length > 0 ? (
              <div className='group-list-service-details'>
                <div className='title-list-service-details'>
                  Dịch vụ theo giờ
                </div>
                <Table
                  className='list-service-details'
                  columns={columnsServiceDetailsPerHOUR(handleUpdateQuantityItem)}
                  dataSource={servicesPerHour}
                  pagination={false}
                />
              </div>
            ) : ''}

            {servicesPerUnit.length > 0 ? (
              <div className='group-list-service-details'>
                <div className='title-list-service-details'>
                  Dịch vụ theo lượt
                </div>
                <Table
                  className='list-service-details'
                  columns={columnsServiceDetailsPerUNIT(handleUpdateQuantityItem)}
                  dataSource={servicesPerUnit}
                  pagination={false}
                />
              </div>
            ) : ''}

          </div>

          <div className='bottom-bill'>

            <div
              className='actions-bill'
            >
              {bill && (
                <>
                  <Button type='primary'>THANH TOÁN</Button>
                  <Button>ĐỔI PHÒNG</Button>
                </>
              )}

              {!bill && (
                <>
                  <Button
                    onClick={handleCheckInRoom}
                    type='primary'
                  >
                    TIẾP NHẬN
                  </Button>
                  <Button>TRA CƯỚC</Button>
                </>
              )}
            </div>

          </div>


        </div>
      </Col>


    </Row>
  )
}
export default withRouter(Payment)
