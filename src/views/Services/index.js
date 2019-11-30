/* eslint-disable linebreak-style */
/* eslint-disable arrow-body-style */
/* eslint-disable linebreak-style */
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
import Checkbox from '@material-ui/core/Checkbox'
import { AgGridReact } from 'ag-grid-react'
import { client } from 'config/client'
import { Notify } from 'helpers/notify'
import { parseError } from 'helpers'
import { Grid } from '@material-ui/core'
import { Icon, Button, Modal } from 'antd'
import { GET_SERVICES, GET_SERVICE, DELETE_SERVICE, UPDATE_SERVICE } from './query'
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
    if (kw !== '')
    { setServices(servicesList.filter(service =>
      service.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(kw))) 
    }
    else setServices(servicesList)
  }

  const columnDefs = [
    {
      headerName: 'Name',
      field: 'name',
      sortable: true,
      resizable: true
    },
    {
      headerName: 'Type',
      field: 'type',
      filter: 'agTextColumnFilter',
      resizable: true,
      sortable: true
    },
    {
      headerName: 'Unit Price',
      field: 'unitPrice',
      resizable: true,
      sortable: true
    },
    {
      headerName: 'Action',
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
                    throw new Error('Something went wrong!')
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
                title: 'Do you Want to delete this service?',
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
                        throw Error('Something went wrong!')
                      }
                      await getServices()
                      return new Notify('success', 'Delete Service successfully!')
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
      <h2 className='title-page'>Service List</h2>

      <form className='margin'>
        <Grid container spacing={1} alignItems='flex-end'>
          <Grid item>
            <SearchIcon />
          </Grid>
          <Grid item>
            <TextField
              id='input-with-icon-grid'
              label='Search Service'
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
        Add Service
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
