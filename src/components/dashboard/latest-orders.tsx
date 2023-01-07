import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import {
   Avatar,
   Box,
   Button,
   Card,
   CardHeader,
   IconButton,
   Skeleton,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Tooltip,
   Typography
} from '@mui/material'
import PencilIcon from 'icons/pencil'
import { Order } from 'models/order'
import NextLink from 'next/link'
import PerfectScrollbar from 'react-perfect-scrollbar'
import useSWR from 'swr'
import { SeverityPill } from '../severity-pill'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import orderApi from 'api/orderApi'
import { PaginationParamsV2 } from 'models'
import { useSnackbar } from 'notistack'

const NUMBER_ORDERS: number = 6

const DEFAULT_PAGINATION = {
   limit: 0,
   page: 1,
   total: 10,
}

export const LatestOrders = (props: any) => {
   const [orders, setOrders] = useState<Order[]>([])
   const [pagination, setPagination] = useState<PaginationParamsV2>(DEFAULT_PAGINATION)
   const {enqueueSnackbar} = useSnackbar();

   useEffect(() => {
      const getOrders = () => {
         orderApi.listOrder(pagination.limit, pagination.page)
         .then(({response}) => {
            setOrders(response?.data)
         })
         .catch(({error}) => {
            enqueueSnackbar(error.message, {
               variant: 'error'
            })
         })
      }

      getOrders()
   },[])


   return (
      <Card {...props}>
         <CardHeader sx={{ fontWeight: 'bold' }} title="Latest Orders" />
         <PerfectScrollbar>
            <Box>
               <Table>
                  <TableHead>
                     <TableRow>
                        <TableCell align="left">Customer</TableCell>
                        <TableCell align="center">Products</TableCell>
                        <TableCell align="center">Total</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {orders
                        ? orders.map((order: Order) => (
                             <TableRow hover key={order.id}>
                                <TableCell align="left">
                                   <Link href={`customers/${order.user_id}`} passHref legacyBehavior>
                                      <Typography
                                         sx={{
                                            cursor: 'pointer',
                                            ':hover': {
                                               textDecoration: 'underline'
                                            }
                                         }}
                                         variant="body2"
                                      >
                                         {order.name}
                                      </Typography>
                                   </Link>
                                </TableCell>
                                <TableCell align="center">
                                   <Box
                                      sx={{
                                         display: 'flex',
                                         alignItems: 'end',
                                         gap: 1
                                      }}
                                   >
                                      {order.items.slice(0, 3).map(product => (
                                         <Tooltip
                                            key={product.id}
                                            title={product.food_origin.name}
                                            placement="top"
                                         >
                                            <Avatar variant="rounded" src={product.food_origin.images.url} />
                                         </Tooltip>
                                      ))}
                                      {order.items.length > 3 && (
                                         <Tooltip title="and more..." placement="top">
                                            <Box sx={{ height: '100%' }}>
                                               <Typography>...</Typography>
                                            </Box>
                                         </Tooltip>
                                      )}
                                   </Box>
                                </TableCell>
                                <TableCell align="center">${order.total_price.toFixed(2)}</TableCell>
                                <TableCell align="center">
                                   <SeverityPill
                                      color={
                                       {
                                          pending: 'info',
                                          preparing: 'secondary',
                                          on_the_way: 'error',
                                          delivered: 'primary',
                                          cancel: 'warning'
                                       }[order.tracking_state || 'pending']
                                      }
                                   >
                                      {order.tracking_state === "on_the_way" ? "Shipping" : order.tracking_state}
                                   </SeverityPill>
                                </TableCell>
                                <TableCell align="center">
                                   <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Link href={`/orders/${order.id}/edit`} passHref legacyBehavior>
                                         <Tooltip title="Edit Order" placement="top">
                                            <IconButton size="small">
                                               <PencilIcon width={20} />
                                            </IconButton>
                                         </Tooltip>
                                      </Link>
                                      <Link href={`/orders/${order.id}`} passHref legacyBehavior>
                                         <Tooltip title="View Details" placement="top">
                                            <IconButton size="small">
                                               <ArrowForwardIcon fontSize="small" />
                                            </IconButton>
                                         </Tooltip>
                                      </Link>
                                   </Box>
                                </TableCell>
                             </TableRow>
                          ))
                        : Array.from(new Array(NUMBER_ORDERS)).map((item, idx) => (
                             <TableRow hover key={idx}>
                                <TableCell align="left">
                                   <Skeleton variant="text" />
                                </TableCell>
                                <TableCell align="center">
                                   <Skeleton variant="text" />
                                </TableCell>
                                <TableCell align="center">
                                   <Skeleton variant="text" />
                                </TableCell>
                                <TableCell align="center">
                                   <Skeleton variant="text" />
                                </TableCell>
                                <TableCell align="center">
                                   <Skeleton variant="text" />
                                </TableCell>
                             </TableRow>
                          ))}
                  </TableBody>
               </Table>
            </Box>
         </PerfectScrollbar>
         <Box
            sx={{
               display: 'flex',
               justifyContent: 'flex-end',
               p: 2
            }}
         >
            <NextLink href={'/orders'} passHref legacyBehavior>
               <Button
                  color="primary"
                  endIcon={<ArrowRightIcon fontSize="small" />}
                  size="small"
                  variant="text"
               >
                  View all
               </Button>
            </NextLink>
         </Box>
      </Card>
   );
}
