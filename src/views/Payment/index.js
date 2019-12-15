import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import './style.less'
import { Col, Row, Tabs } from 'antd'
import { client } from 'config/client'
import { Notify } from 'helpers/notify'
import { parseError } from 'helpers'
import { GET_ROOMS } from './query'

const { TabPane } = Tabs

const Payment = props => {
  const [rooms, setRooms] = useState([])

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
      })
      .catch(err => new Notify('error', parseError(err)))
  }

  useEffect(() => {
    getRooms()
  }, [])

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
                  <div className='room'>
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
          <div className='title-bill'>Hóa đơn dịch vụ</div>
          <div className='room-bill'>
            Phòng
            <div className='room-name'>A.4</div>
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
