import { yupResolver } from '@hookform/resolvers/yup'
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
   Skeleton,
   Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { CustomSelectField, CustomTextField } from 'components/form-controls'
import { OrderStatus } from 'constants/enums/order-status'
import { regexVietnamesePhoneNumber } from 'constants/regexes'
import {
   District,
   EditCustomerFormValues,
   EditOrderFormValues,
   Order,
   Province,
   User
} from 'models'
import React, { MouseEvent, useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import * as yup from 'yup'
import Link from 'next/link'
import { ConfirmDialog } from 'components/product/confirm-dialog'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import axios, { AxiosResponse } from 'axios'
import useSWR from 'swr'
import { LoadingBackdrop } from 'components/loading'

const schema = yup.object().shape({
   name: yup.string().max(255),
   phone: yup
      .string()
      .max(255)

      .test('is-vietnamese-phonenumber1', 'Incorrect phone number format.', number => {
         if (!number) return true

         return regexVietnamesePhoneNumber.test(number)
      }),
   email: yup.string().email().max(255).nullable()
})
const CustomerBasicInfoCardEdit = ({ customer, onSave, onDelete }) => {
   const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
   const [loading, setLoading] = useState(false)

   const {
      control,
      formState: { isSubmitting },
      handleSubmit,
      reset
   } = useForm({
      defaultValues: {
         username: '',
         name: '',
         phone: '',
         email: ''
      },
      resolver: yupResolver(schema)
   })
   // const watchProvince = useWatch({
   //    control,
   //    name: 'deliveryInfo.address.province'
   // })
   // const watchDistrict = useWatch({
   //    control,
   //    name: 'deliveryInfo.address.district'
   // })

   useEffect(() => {
      if (customer) {
         reset({
            username: customer.first_name,
            name: customer.last_name,
            phone: customer.phone,
            email: customer.email
         })
      }
   }, [customer, reset])

   const handleSave = async values => {
      console.log(values)
      if (onSave) {
         const payload = { ...values }
         await onSave(payload)
      }
   }

   const handleDeleteClick = async event => {
      setOpenConfirmDialog(false)
      setLoading(true)
      // if (onDelete) await onDelete()
      setLoading(false)
   }

   function randomColor() {
      let backgroundColor = [
         '#ab000d',
         '#5c007a',
         '#00227b',
         '#00701a',
         '#8c9900',
         '#c68400',
         '#40241a',
         '#29434e'
      ]
      let random = Math.floor(Math.random() * backgroundColor.length)
      return backgroundColor[random]
   }

   return (
      <Card>
         <LoadingBackdrop open={loading} />

         <CardHeader title="Edit customer" />
         <Divider />
         <CardContent>
            <form onSubmit={handleSubmit(handleSave)}>
               <Typography variant="subtitle1">Account information</Typography>
               <Grid container columnSpacing={3} sx={{ mb: 2 }}>
                  <Grid item md={6} xs={12}>
                     <CustomTextField
                        disabled={isSubmitting || !customer}
                        control={control}
                        name="name"
                        label="First Name"
                     />
                  </Grid>
                  <Grid item md={6} xs={12}>
                     <CustomTextField
                        disabled={isSubmitting || !customer}
                        control={control}
                        name="username"
                        label="Last name"
                     />
                  </Grid>
                  <Grid item md={6} xs={12}>
                     <CustomTextField
                        disabled={isSubmitting || !customer}
                        control={control}
                        type="number"
                        name="phone"
                        label="Phone Number"
                     />
                  </Grid>
                  <Grid item md={6} xs={12}>
                     <CustomTextField disabled control={control} name="email" label="Email" />
                  </Grid>
               </Grid>
               <Divider />
            </form>
         </CardContent>
         {customer && (
            <CardActions sx={{ m: 2, justifyContent: 'space-between' }}>
               <Box sx={{ display: 'flex', gap: 2 }}>
                  <Link href={`/customers/${customer.id}`} passHref legacyBehavior>
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
                  Delete customer
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
            body="Are you sure to delete this customer?"
            onSubmit={handleDeleteClick}
            onClose={() => setOpenConfirmDialog(false)}
         />
      </Card>
   )
}
export default CustomerBasicInfoCardEdit
