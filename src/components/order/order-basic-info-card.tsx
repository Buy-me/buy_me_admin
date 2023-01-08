import {
   Box,
   Card,
   CardContent,
   CardHeader,
   Divider,
   List,
   ListItem,
   Skeleton,
   Typography
} from '@mui/material'
import { format, parseISO } from 'date-fns'
import { Order } from 'models'
import React from 'react'
import Link from 'next/link'
export interface OrderBasicInfoCardProps {
   order?: Order
}

export function OrderBasicInfoCard({ order }: OrderBasicInfoCardProps) {
   return (
      <Card>
         <CardHeader title="Basic info" />
         <Divider />
         <CardContent sx={{ p: 0 }}>
            {order ? (
               <List>
                  <ListItem
                     sx={{ px: 3, py: 1.5, display: 'flex', flexDirection: 'row', my: 0 }}
                     alignItems="center"
                     disablePadding
                  >
                     <Typography variant="subtitle2" sx={{ minWidth: 180 }}>
                        Delivery information
                     </Typography>
                     <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="primary">
                           <Link href={`/customers/${order.user_id}`} passHref legacyBehavior>
                              {order.name}
                           </Link>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                           {order.detail_address}
                        </Typography>
                     </Box>
                  </ListItem>
                  <Divider />

                  <ListItem
                     sx={{ px: 3, py: 1.5, display: 'flex', flexDirection: 'row', my: 0 }}
                     alignItems="center"
                     disablePadding
                  >
                     <Typography variant="subtitle2" sx={{ minWidth: 180 }}>
                        ID
                     </Typography>
                     <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                           {order.id}
                        </Typography>
                     </Box>
                  </ListItem>
                  <Divider />

                  <ListItem
                     sx={{ px: 3, py: 1.5, display: 'flex', flexDirection: 'row', my: 0 }}
                     alignItems="center"
                     disablePadding
                  >
                     <Typography variant="subtitle2" sx={{ minWidth: 180 }}>
                        Date
                     </Typography>
                     <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                           {/* {parseISO(order.createdAt)} */}
                           {order.created_at &&
                              format(parseISO(order.created_at), 'dd/MM/yyyy HH:mm')}
                        </Typography>
                     </Box>
                  </ListItem>
                  <Divider />

                  <ListItem
                     sx={{ px: 3, py: 1.5, display: 'flex', flexDirection: 'row', my: 0 }}
                     alignItems="center"
                     disablePadding
                  >
                     <Typography variant="subtitle2" sx={{ minWidth: 180 }}>
                        Payment Method
                     </Typography>
                     <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text">
                           {order.type}
                        </Typography>
                     </Box>
                  </ListItem>
                  <Divider />

                  <ListItem
                     sx={{ px: 3, py: 1.5, display: 'flex', flexDirection: 'row', my: 0 }}
                     alignItems="center"
                     disablePadding
                  >
                     <Typography variant="subtitle2" sx={{ minWidth: 180 }}>
                        Total Amount
                     </Typography>
                     <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text">
                           ${order.total_price.toFixed(2)}
                        </Typography>
                     </Box>
                  </ListItem>
                  <Divider />

                  <ListItem
                     sx={{ px: 3, pt: 1.5, display: 'flex', flexDirection: 'row', my: 0 }}
                     alignItems="center"
                     disablePadding
                  >
                     <Typography variant="subtitle2" sx={{ minWidth: 180 }}>
                        Status
                     </Typography>
                     <Box sx={{ flex: 1 }}>
                        <Typography
                           variant="body2"
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
                           {order.tracking_state === "on_the_way" ? "Shipping" : order.tracking_state[0].toUpperCase() + order.tracking_state.substring(1)}
                        </Typography>
                     </Box>
                  </ListItem>
               </List>
            ) : (
               <List>
                  {Array.from(new Array(6)).map((i, idx) => (
                     <ListItem key={idx} sx={{ px: 3, pt: 1.5 }} alignItems="center" disablePadding>
                        <Skeleton variant="text" sx={{ flex: 1, mb: 1 }} height={40} />
                        <Divider />
                     </ListItem>
                  ))}
               </List>
            )}
         </CardContent>
      </Card>
   )
}
