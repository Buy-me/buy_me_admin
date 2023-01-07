import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import {
   Avatar,
   Button,
   Card,
   CardActions,
   CardContent,
   CardHeader,
   Divider,
   Grid,
   InputAdornment,
   Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { CustomSelectField, CustomTextField } from 'components/form-controls'
import { OrderStatus } from 'constants/enums/order-status'
import { regexVietnamesePhoneNumber } from 'constants/regexes'
import { EditOrderFormValues, Order } from 'models'
import React, { MouseEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import Link from 'next/link'
import { ConfirmDialog } from 'components/product/confirm-dialog'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import { LoadingBackdrop } from 'components/loading'

export interface OrderBasicInfoCardEditProps {
   order?: Order
   onSave: Function
   onDelete: Function
}

const schema = yup.object().shape({
   name: yup.string().max(255),
   phone: yup
      .string()
      .max(255)

      .test('is-vietnamese-phonenumber', 'Incorrect phone number format.', number => {
         if (!number) return true

         return regexVietnamesePhoneNumber.test(number)
      }),
   detail_address: yup.string().max(255).nullable(),
   total_price: yup.number().required().nullable().typeError('you must specify a number'),
   tracking_state: yup.string().max(255).required(),
})

export function OrderBasicInfoCardEdit({ order, onSave, onDelete }: OrderBasicInfoCardEditProps) {
   const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
   const [loading, setLoading] = useState(false)
   const {
      control,
      formState: { isSubmitting },
      handleSubmit,
      reset
   } = useForm<EditOrderFormValues>({
      defaultValues: {
         name: '',
         phone: '',
         detail_address: '',
         total_price: 0,
         tracking_state: 'pending',
      },
      resolver: yupResolver(schema)
   })

   useEffect(() => {
      if (order) {
         reset({
            name: order.name,
            phone: order.phone,
            detail_address: order.detail_address,
            total_price: order.total_price,
            tracking_state: order.tracking_state,
         })
      }
   }, [order, reset])

   const handleSave = async (values: EditOrderFormValues) => {
      if (onSave) {
         const payload = {
            name: values.name,
            phone: values.phone,
            detail_address: values.detail_address,
            total_price: values.total_price,
            tracking_state: values.tracking_state,
         }
         await onSave(payload)
      }
   }

   const handleDeleteClick = async (event: MouseEvent) => {
      setOpenConfirmDialog(false)
      setLoading(true)
      if (onDelete) await onDelete()
      setLoading(false)
   }

   return (
      <Card>
         <LoadingBackdrop open={loading} />

         <CardHeader title="Update order status" />
         <Divider />
         <CardContent>
            <form onSubmit={handleSubmit(handleSave)}>
               <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                     <CustomTextField
                        disabled={true}
                        control={control}
                        name="name"
                        label="Recipient's Name"
                     />
                  </Grid>
                  <Grid item md={6} xs={12}>
                     <CustomTextField
                        disabled={true}
                        control={control}
                        name="phone"
                        label="Recipient's Phone Number"
                     />
                  </Grid>
               </Grid>
               <Typography variant="subtitle2">Address</Typography>
               <Grid container columnSpacing={3}>
                  <Grid item md={12} xs={12}>
                     <CustomTextField
                        disabled={true}
                        control={control}
                        name="detail_address"
                        label="Address"
                     />
                  </Grid>
                  <Grid item md={6} xs={12}>
                     <CustomTextField
                        disabled={true}
                        control={control}
                        name="total_price"
                        label="Total Price"
                        InputProps={{
                           startAdornment: <InputAdornment position="start">$</InputAdornment>
                        }}
                     />
                  </Grid>
                  <Grid item md={6} xs={12}>
                     <CustomSelectField
                        control={control}
                        name="tracking_state"
                        label="Status"
                        disabled={isSubmitting || !order}
                        options={OrderStatus.map(item => ({
                           label: item === "on_the_way" ? "Shipping" : item[0].toUpperCase() + item.substring(1),
                           value: item
                        }))}
                     />
                  </Grid>
               </Grid>
            </form>
         </CardContent>
         {order && (
            <CardActions sx={{ m: 2, justifyContent: 'space-between' }}>
               <Box sx={{ display: 'flex', gap: 2 }}>
                  <Link href={`/orders`} passHref legacyBehavior>
                     <Button variant="outlined" disabled={isSubmitting}>
                        Cancel
                     </Button>
                  </Link>
                  <Button
                     variant="contained"
                     onClick={handleSubmit(handleSave)}
                     disabled={isSubmitting}
                  >
                     Update
                  </Button>
               </Box>
               <Button
                  variant="text"
                  color="error"
                  disabled={isSubmitting}
                  onClick={() => setOpenConfirmDialog(true)}
               >
                  Delete order
               </Button>
            </CardActions>
         )}

         <ConfirmDialog
            icon={
               <Avatar sx={{ bgcolor: 'rgba(209, 67, 67, 0.08)', color: 'rgb(209, 67, 67)' }}>
                  <ReportProblemIcon />
               </Avatar>
            }
            isOpen={openConfirmDialog}
            title="Are you sure?"
            body="Are you sure to delete this order?"
            onSubmit={handleDeleteClick}
            onClose={() => setOpenConfirmDialog(false)}
         />
      </Card>
   );
}
