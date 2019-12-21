import React, { useState, useEffect } from 'react'
import { client } from 'config/client'
import { Notify } from 'helpers/notify'
import moment from 'moment'
import { parseError, FormatMoney } from 'helpers'
import { Modal, Radio, Table, DatePicker } from 'antd'
import { GETReportRevenueRooms, GETReportRevenueServices, GETReportThuChiTongHop } from './query'
import './style.less'
import { columnsdefs, columnsdefsDV, columnsdefsTH } from './columnsdefs'

const { confirm } = Modal
const { RangePicker } = DatePicker

const UserManagement = () => {
  const [tab, setTab] = useState('phong')
  const [startDate, setStartDate] = useState(moment().subtract(7, 'd').startOf('day'))
  const [endDate, setEndDate] = useState(moment().endOf('day'))

  const [listReportRevenueRooms, setListReportRevenueRooms] = useState([])
  const [listReportRevenueServices, setListReportRevenueServices] = useState([])
  const [listReportThuChiTongHop, setListReportThuChiTongHop] = useState([])


  // eslint-disable-next-line no-shadow
  const getReportRevenueRooms = async (startDate, endDate) => {
    await client
      .query({
        query: GETReportRevenueRooms,
        variables: {
          startDate,
          endDate
        }
      })
      .then(res => {
        if (!res || !res.data || !res.data.ReportRevenueRooms) {
          throw new Error('Có lỗi xảy ra!')
        }
        setListReportRevenueRooms(res.data.ReportRevenueRooms)
      })
      .catch(err => new Notify('error', parseError(err)))
  }


  // eslint-disable-next-line no-shadow
  const getReportRevenueServices = async (startDate, endDate) => {
    await client
      .query({
        query: GETReportRevenueServices,
        variables: {
          startDate,
          endDate
        }
      })
      .then(res => {
        if (!res || !res.data || !res.data.ReportRevenueServices) {
          throw new Error('Có lỗi xảy ra!')
        }
        setListReportRevenueServices(res.data.ReportRevenueServices)
      })
      .catch(err => new Notify('error', parseError(err)))
  }


  // eslint-disable-next-line no-shadow
  const getReportThuChiTongHop = async (startDate, endDate) => {
    await client
      .query({
        query: GETReportThuChiTongHop,
        variables: {
          startDate,
          endDate
        }
      })
      .then(res => {
        if (!res || !res.data || !res.data.ReportThuChiTongHop) {
          throw new Error('Có lỗi xảy ra!')
        }
        setListReportThuChiTongHop(res.data.ReportThuChiTongHop)
      })
      .catch(err => new Notify('error', parseError(err)))
  }

  useEffect(() => {
    getReportRevenueRooms(+startDate, +endDate)
  }, [])

  const handleChangeType = async ({ target: { value } }) => {
    console.log(value)
    setTab(value)
    if (value === 'phong') {
      await getReportRevenueRooms(+startDate, +endDate)
    }
    if (value === 'dichvu') {
      await getReportRevenueServices(+startDate, +endDate)
    }

    if (tab === 'tonghop') {
      await getReportThuChiTongHop(+startDate, +endDate)
    }
  }

  const handleChangeRangeTime = async (value) => {
    const date1 = value[0].startOf('day')
    const date2 = value[1].endOf('day')
    setStartDate(date1)
    setEndDate(date2)
    if (tab === 'phong') {
      await getReportRevenueRooms(+date1, +date2)
    }

    if (value === 'dichvu') {
      await getReportRevenueServices(+date1, +date2)
    }

    if (tab === 'tonghop') {
      await getReportThuChiTongHop(+date1, +date2)
    }
  }

  return (
    <div className='page-reportManagement'>
      <h2 className='title-page'>
        Report management
      </h2>

      <div className='group-button'>

        <Radio.Group
          className='left'
          buttonStyle='solid'
          defaultValue={tab}

          onChange={handleChangeType}
          style={{ marginBottom: 16 }}
        >
          <Radio.Button value='phong'>Doanh thu phòng</Radio.Button>
          <Radio.Button value='dichvu'>Doanh thu dịch vụ</Radio.Button>
          <Radio.Button value='tonghop'>Thu chi tổng hợp</Radio.Button>
        </Radio.Group>

        <RangePicker
          value={[startDate, endDate]}
          className='right'
          format='DD/MM/YYYY'
          onChange={handleChangeRangeTime}
        />


      </div>

      {tab === 'phong' && (
        <>
          <Table
            className='list-report'
            columns={columnsdefs}
            dataSource={listReportRevenueRooms}
            pagination={false}
          />
          <div className='summary'>
            <div>
              Tổng tiền phòng:
              {' '}
              {FormatMoney(listReportRevenueRooms.reduce((sum, bill) => sum + bill.roomDetails.reduce((total, obj) => total + obj.total, 0), 0))}
            </div>
            <div>
              Tổng tiền dịch vụ:
              {' '}
              {FormatMoney(listReportRevenueRooms.reduce((sum, bill) => sum + bill.serviceDetails.reduce((total, obj) => total + obj.total, 0), 0))}
            </div>
            <div>
              Tổng tiền:
              {' '}
              {FormatMoney(listReportRevenueRooms.reduce((sum, bill) => sum + bill.total, 0))}
            </div>
          </div>
        </>
      )}

      {tab === 'dichvu' && (
        <>
          <Table
            className='list-report'
            columns={columnsdefsDV}
            dataSource={listReportRevenueServices}
            pagination={false}
          />
          <div className='summary'>
            <div>
              Tổng tiền dịch vụ theo giờ:
              {' '}
              {FormatMoney(listReportRevenueServices.reduce((sum, obj) => sum + (obj.type === 'perHOUR' ? obj.total : 0), 0))}
            </div>
            <div>
              Tổng tiền dịch vụ theo lượt:
              {' '}
              {FormatMoney(listReportRevenueServices.reduce((sum, obj) => sum + (obj.type === 'perUNIT' ? obj.total : 0), 0))}
            </div>
            <div>
              Tổng tiền:
              {' '}
              {FormatMoney(listReportRevenueServices.reduce((sum, obj) => sum + obj.total, 0))}
            </div>
          </div>
        </>
      )}


      {tab === 'dichvu' && (
        <>
          <Table
            className='list-report'
            columns={columnsdefsTH}
            dataSource={listReportThuChiTongHop}
            pagination={false}
          />
          {/* <div className='summary'>
            <div>
              Tổng tiền dịch vụ theo giờ:
              {' '}
              {FormatMoney(listReportRevenueServices.reduce((sum, obj) => sum + (obj.type === 'perHOUR' ? obj.total : 0), 0))}
            </div>
            <div>
              Tổng tiền dịch vụ theo lượt:
              {' '}
              {FormatMoney(listReportRevenueServices.reduce((sum, obj) => sum + (obj.type === 'perUNIT' ? obj.total : 0), 0))}
            </div>
            <div>
              Tổng tiền:
              {' '}
              {FormatMoney(listReportRevenueServices.reduce((sum, obj) => sum + obj.total, 0))}
            </div>
          </div> */}
        </>
      )}


    </div>

  )
}

export default UserManagement