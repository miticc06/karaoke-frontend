
import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import './style.less'
import { Col, Row, Tabs, Button, Table } from 'antd'
import { client } from 'config/client'
import { Notify } from 'helpers/notify'
import { parseError } from 'helpers'
import moment from 'moment'
import { GET_ROOMS, GET_BILL_BY_ROOM_ID } from './query'
import { columnsRoomDetails, columnsServiceDetailsPerHOUR, columnsServiceDetailsPerUNIT } from './columnsTable'

const { TabPane } = Tabs

const Payment = props => {
  const [rooms, setRooms] = useState([])
  const [roomSelected, setRoomSelected] = useState(null)
  const [bill, setBill] = useState(null)

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

  useEffect(() => {
    getRooms()
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
    const room = rooms.filter(obj => obj._id === roomId)[0]
    setRoomSelected(room)
    // getBillByRoomId(roomId)
  }

  const servicesPerHour = bill && bill.serviceDetails ? bill.serviceDetails.filter(obj => obj.service.type === 'perHOUR') : []
  const servicesPerUnit = bill && bill.serviceDetails ? bill.serviceDetails.filter(obj => obj.service.type === 'perUNIT') : []

  return (
    <Row className='payment'>
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
                    {room.name}
                  </div>
                ))}
              </div>
            </TabPane>
            <TabPane tab='Dịch vụ' key='2'>
              tab2
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
                  columns={columnsServiceDetailsPerHOUR}
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
                  columns={columnsServiceDetailsPerUNIT}
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
              <Button type='primary'>TIẾP NHẬN</Button>
              <Button>THANH TOÁN</Button>
            </div>

          </div>


        </div>
      </Col>

    </Row>


    //     <div className='payment'>
    //       <div className='left'>

    // </div>
    // <div className='right'>

    // </div>
    //     </div>
  )
}
export default withRouter(Payment)
