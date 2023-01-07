import {
   Box,
   Card,
   Container,
   Divider,
   Tab,
   TablePagination,
   Tabs,
   Typography
} from '@mui/material'
import axiosClient from 'api-client/axios-client'
import orderApi from 'api/orderApi'
import DashboardLayout from 'components/layouts/dashboard-layout'
import { OrderDetailModal } from 'components/order/order-detail'
import { OrderListResults } from 'components/order/order-list-results'
import { Order, PaginationParams, PaginationParamsV2, ResponseListData } from 'models'
import Head from 'next/head'
import queryString from 'query-string'
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import useSwr from 'swr'
import {useSnackbar} from 'notistack'

const DEFAULT_PAGINATION = {
   limit: 10,
   page: 1,
   total: 10,
}

const Orders = () => {
   const [filters, setFilters] = useState({ status: '', orderBy: 'updatedAt-desc' })
   const [pagination, setPagination] = useState<PaginationParamsV2>(DEFAULT_PAGINATION)
   const [orderList, setOrderList] = useState([]);

   const {enqueueSnackbar} = useSnackbar()

   useEffect(() => {
      const getOrders = () => {
         orderApi.listOrder(pagination.limit, pagination.page)
         .then(({response}) => {
            setOrderList(response?.data)
         })
         .catch(({error}) => {
            enqueueSnackbar(error.message, {
               variant: 'error'
            })
         })
      }

      getOrders()
   },[])

   const handleLimitChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPagination({ ...pagination, limit: Number.parseInt(event.target.value) })
   }

   const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPagination({ ...pagination, page: newPage + 1 })
   }

   const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
      setPagination(DEFAULT_PAGINATION)
      setFilters({
         ...filters,
         status: newValue
      })
   }

   const handleSortOrder = (orderBy: string) => {
      setPagination(DEFAULT_PAGINATION)
      setFilters({
         ...filters,
         orderBy
      })
   }

   return (
      <>
         <Head>
            <title>Orders | FurnitureStore</title>
         </Head>
         <Box
            component="main"
            sx={{
               flexGrow: 1,
               py: 8
            }}
         >
            <Container maxWidth={false}>
               <Box
                  sx={{
                     alignItems: 'center',
                     display: 'flex',
                     justifyContent: 'space-between',
                     flexWrap: 'wrap',
                     m: -1
                  }}
               >
                  <Typography sx={{ m: 1 }} variant="h4">
                     Orders
                  </Typography>
               </Box>
               <Box sx={{ mt: 1 }}>
                  <Card>
                     <Tabs value={filters.status} onChange={handleChangeTab}>
                        <Tab label="All" value="" />
                        {/* <Tab label="Pending" value="PENDING" />
                        <Tab label="Processing" value="PROCESSING" />
                        <Tab label="Deliveried" value="DELIVERIED" />
                        <Tab label="Canceled" value="CANCELED" /> */}
                     </Tabs>
                     <Divider />

                     <PerfectScrollbar>
                        <Box sx={{ width: '100%' }}>
                           <OrderListResults
                              orderList={orderList}
                              onSortByColumn={handleSortOrder}
                           />
                        </Box>
                     </PerfectScrollbar>
                     <TablePagination
                        component="div"
                        count={pagination.total}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleLimitChange}
                        page={pagination.page - 1}
                        rowsPerPage={pagination.limit}
                        rowsPerPageOptions={[5, 10, 25]}
                     />
                  </Card>
               </Box>
            </Container>
         </Box>
      </>
   )
}
Orders.Layout = DashboardLayout

export default Orders
