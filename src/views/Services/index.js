
import React, { useState, useEffect } from 'react'
import SearchIcon from '@material-ui/icons/Search'
import TextField from '@material-ui/core/TextField'
import { AgGridReact } from 'ag-grid-react'
import { client } from 'config/client'
import { Notify } from 'helpers/notify'
import { parseError, FormatMoney } from 'helpers'
import { Grid } from '@material-ui/core'
import { Icon, Button, Modal } from 'antd'
import { GET_SERVICES, GET_SERVICE, DELETE_SERVICE } from './query'
import './style.less'

import ModalAddService from './ModalAddService'
import ModalEditService from './ModalEditService'

const { confirm } = Modal

const ServiceManagement = () => {
  const [services, setServices] = useState([])
  const [servicesList, setServicesList] = useState([])
  const [visibleAdd, setVisibleAdd] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [serviceEdit, setServiceEdit] = useState(null)

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
        setServicesList(res.data.services)
      })
      .catch(err => new Notify('error', parseError(err)))
  }

  useEffect(() => {
    getServices()
  }, [])

  const setTextValue = event => {
    let kw = event.target.value
    kw = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    if (kw !== '') {
      setServices(servicesList.filter(service => service.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(kw)))
    } else setServices(servicesList)
  }

  const columnDefs = [
    {
      headerName: 'Tên dịch vụ',
      field: 'name',
      sortable: true,
      resizable: true
    },
    {
      headerName: 'Loại hình dịch vụ',
      field: 'type',
      filter: 'agTextColumnFilter',
      resizable: true,
      sortable: true,
      cellRendererFramework: data => (data.value === 'perHOUR' ? 'Theo giờ' : 'Theo lượt')
    },
    {
      headerName: 'Đơn giá',
      field: 'unitPrice',
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
                  query: GET_SERVICE,
                  variables: {
                    serviceId: row.data._id
                  }
                })
                .then(res => {
                  if (!res || !res.data || !res.data.service) {
                    throw new Error('Có lỗi xảy ra!')
                  }
                  setServiceEdit(res.data.service)
                })
                .catch(err => new Notify('error', parseError(err)))
            }}
            type='edit'
          />
          <Icon
            style={{ cursor: 'pointer', margin: '5px' }}
            onClick={async () => {
              confirm({
                title: 'Xác nhận xoá dịch vụ phòng?',
                okType: 'danger',
                content: `- ${row.data.name} `,
                onOk: async () => {
                  await client
                    .mutate({
                      mutation: DELETE_SERVICE,
                      variables: {
                        serviceId: row.data._id
                      }
                    })
                    .then(async res => {
                      if (!res || !res.data || !res.data.deleteService) {
                        throw Error('Có lỗi xảy ra!')
                      }
                      await getServices()
                      return new Notify('success', 'Xoá dịch vụ phòng thành công!')
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
      <h2 className='title-page'>QUẢN LÝ DỊCH VỤ PHÒNG</h2>

      <form className='margin'>
        <Grid container spacing={1} alignItems='flex-end'>
          <Grid item>
            <SearchIcon />
          </Grid>
          <Grid item>
            <TextField
              id='input-with-icon-grid'
              label='Tìm kiếm tên dịch vụ...'
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
            rowData={services}
            onGridReady={onGridReady}
          />
        </div>
      </Grid>

      <ModalAddService
        visible={visibleAdd}
        hide={() => setVisibleAdd(false)}
        refetch={getServices}
      />

      <ModalEditService
        service={serviceEdit}
        visible={visibleEdit}
        hide={() => setVisibleEdit(false)}
        refetch={getServices}
      />
    </div>
  )
}

export default ServiceManagement
