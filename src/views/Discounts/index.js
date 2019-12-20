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
import { GET_DISCOUNTS, GET_DISCOUNT, DELETE_DISCOUNT, UPDATE_DISCOUNT } from './query'
import './style.less'

import ModalAddDiscount from './ModalAddDiscount'
import ModalEditDiscount from './ModalEditDiscount'

const { confirm } = Modal

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([])
  const [discountsList, setDiscountsList] = useState([])
  const [visibleAdd, setVisibleAdd] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [discountEdit, setDiscountEdit] = useState(null)

  const getDiscounts = async () => {
    await client
      .query({
        query: GET_DISCOUNTS
      })
      .then(res => {
        if (!res || !res.data || !res.data.discounts) {
          throw new Error('Có lỗi xảy ra!')
        }

        setDiscounts(res.data.discounts)
        setDiscountsList(res.data.discounts)
      })
      .catch(err => new Notify('error', parseError(err)))
  }

  useEffect(() => {
    getDiscounts()
  }, [])

  const setTextValue = event => {
    let kw = event.target.value
    kw = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    if (kw !== '') {
      setDiscounts(discountsList.filter(discount => discount.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(kw)))
    } else setDiscounts(discountsList)
  }

  const columnDefs = [
    {
      headerName: 'Tên khuyến mãi',
      filter: 'agTextColumnFilter',
      field: 'name',
      sortable: true,
      resizable: true
    },
    {
      headerName: 'Hình thức',
      field: 'type',
      filter: 'agTextColumnFilter',
      resizable: true,
      sortable: true,
      cellRendererFramework: row => row.value === 'DEDUCT' ? 'Khấu trừ' : 'Phần trăm'
    },
    {
      headerName: 'Trị số',
      field: 'value',
      resizable: true,
      sortable: true
    },

    {
      headerName: 'Ngày bắt đầu',
      field: 'startDate',
      filter: 'agTextColumnFilter',
      resizable: true,
      sortable: true,
      cellRendererFramework: row => moment(row.value).format('DD/MM/YYYY')
    },
    {
      headerName: 'Ngày kết thúc',
      field: 'endDate',
      filter: 'agTextColumnFilter',
      resizable: true,
      sortable: true,
      cellRendererFramework: row => moment(row.value).format('DD/MM/YYYY')
    },
    {
      headerName: 'Người tạo',
      field: 'createdBy.name',
      filter: 'agTextColumnFilter',
      resizable: true,
      sortable: true
    },

    {
      headerName: 'Hiệu lực',
      minWidth: 50,
      width: 120,
      maxWidth: 100,
      suppressMenu: true,
      cellRendererFramework: row => (
        <>
          <Checkbox
            checked={row.data.isActive}
            onClick={
              async () => {
                confirm({
                  title: 'Xác nhận thay đổi trạng thái áp dụng khuyến mãi?',
                  okType: 'danger',
                  // eslint-disable-next-line max-len
                  content: `- ${row.data.name}, từ ${moment(row.data.startDate).format('DD/MM/YYYY')} tới ${moment(row.data.endDate).format('DD/MM/YYYY')}`,
                  onOk:
                    async () => {
                      const d = {
                        name: row.data.name,
                        type: row.data.type,
                        value: row.data.value,
                        isActive: !row.data.isActive,
                        createdBy: row.data.createdBy._id,
                        createdAt: row.data.createdAt,
                        startDate: row.data.startDate,
                        endDate: row.data.endDate
                      }
                      console.log(d)
                      await client
                        .mutate({
                          mutation: UPDATE_DISCOUNT,
                          variables: {
                            discountId: row.data._id,
                            input: d
                          }
                        })
                        .then(async res => {
                          if (!res || !res.data || !res.data.updateDiscount) {
                            throw Error('Có lỗi xảy ra!')
                          }
                          await getDiscounts()
                          return new Notify('success', 'Cập nhật trạng thái thành công!')
                        })
                        .catch(err => new Notify('error', parseError(err)))
                    }
                })
              }
            }
            value='checkedB'
            color='primary'
            inputProps={{
              'aria-label': 'Active/Inactive Discount'
            }}
          />
        </>
      )
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
                  query: GET_DISCOUNT,
                  variables: {
                    discountId: row.data._id
                  }
                })
                .then(res => {
                  if (!res || !res.data || !res.data.discount) {
                    throw new Error('Có lỗi xảy ra!')
                  }
                  setDiscountEdit(res.data.discount)
                })
                .catch(err => new Notify('error', parseError(err)))
            }}
            type='edit'
          />

          <Icon
            style={{ cursor: 'pointer', margin: '5px' }}
            onClick={async () => {
              confirm({
                title: 'Xác nhận xoá khuyến mãi?',
                okType: 'danger',
                // eslint-disable-next-line max-len
                content: `- ${row.data.name}, từ ${moment(row.data.startDate).format('DD/MM/YYYY')} tới ${moment(row.data.endDate).format('DD/MM/YYYY')}`,
                onOk: async () => {
                  await client
                    .mutate({
                      mutation: DELETE_DISCOUNT,
                      variables: {
                        discountId: row.data._id
                      }
                    })
                    .then(async res => {
                      if (!res || !res.data || !res.data.deleteDiscount) {
                        throw Error('Có lỗi xảy ra!')
                      }
                      await getDiscounts()
                      return new Notify('success', 'Xoá khuyến mãi thành công!')
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
      <h2 className='title-page'>QUẢN LÝ KHUYẾN MÃI</h2>

      <form className='margin'>
        <Grid container spacing={1} alignItems='flex-end'>
          <Grid item>
            <SearchIcon />
          </Grid>
          <Grid item>
            <TextField
              id='input-with-icon-grid'
              label='Tìm kiếm tên khuyến mãi...'
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
            rowData={discounts}
            onGridReady={onGridReady}
          />
        </div>
      </Grid>

      <ModalAddDiscount
        visible={visibleAdd}
        hide={() => setVisibleAdd(false)}
        refetch={getDiscounts}
      />

      <ModalEditDiscount
        discount={discountEdit}
        visible={visibleEdit}
        hide={() => setVisibleEdit(false)}
        refetch={getDiscounts}
      />
    </div>
  )
}

export default DiscountManagement
