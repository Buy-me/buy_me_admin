import { useState, useEffect } from 'react'
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, TextField } from '@mui/material'
import { CustomTextField } from 'components/form-controls'
import { regexVietnamesePhoneNumber } from 'constants/regexes'
import * as yup from 'yup'
import { EditProfileFormValues } from 'models'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import userApi from 'api/userApi'

const schema = yup.object().shape({
   name: yup.string().max(255).label('Name'),
   //  username: yup.string(),
   phone: yup
      .string()
      .label('Phone number')
      .test('is-vietnamese-phonenumber', 'Incorrect phone number format.', number => {
         if (!number) return true

         return regexVietnamesePhoneNumber.test(number)
      })
      .nullable(true),
   email: yup.string().email().max(255).label('Email address')
})

const AccountProfileDetails = ({ onSubmit, ...restProps }) => {
   const [profile, setProfile] = useState(null)
   const form = useForm({
      defaultValues: {
         name: profile?.first_name,
         phone: profile?.phone,
         email: profile?.email,
         username: profile?.last_name
      },
      resolver: yupResolver(schema)
   })
   const {
      reset,
      control,
      handleSubmit,
      formState: { isSubmitting }
   } = form

   useEffect(() => {
      const getProfile = async () => {
         const { response, err } = await userApi.profile()
         if (err) {
            console.log(err)
            return
         }
         setProfile(response.data)
      }
      getProfile()
   }, [])

   useEffect(() => {
      reset({
         name: profile?.first_name,
         phone: profile?.phone,
         email: profile?.email,
         username: profile?.last_name
      })
   }, [profile, reset])

   const handleSave = async values => {
      if (onSubmit)
         await onSubmit({
            first_name: values.first_name,
            phone: values.phone,
            last_name: values.last_name
         })
   }
   return (
      <form autoComplete="off" onSubmit={handleSubmit(handleSave)} {...restProps}>
         <Card>
            <CardHeader subheader="The information can be edited" title="Profile" />
            <Divider />
            <CardContent>
               <Grid container columnSpacing={3}>
                  <Grid item md={6} xs={12}>
                     <CustomTextField
                        disabled={isSubmitting}
                        control={control}
                        name="name"
                        label="First name"
                        InputLabelProps={{ shrink: true }}
                     />
                  </Grid>
                  <Grid item md={6} xs={12}>
                     <CustomTextField
                        disabled={isSubmitting}
                        control={control}
                        placeholder="Last Name"
                        name="username"
                        label="Last Name"
                        InputLabelProps={{ shrink: true }}
                     />
                  </Grid>
                  <Grid item md={6} xs={12}>
                     <CustomTextField
                        disabled={true}
                        control={control}
                        placeholder="Email"
                        name="email"
                        label="Email"
                        InputLabelProps={{ shrink: true }}
                     />
                  </Grid>
                  <Grid item md={6} xs={12}>
                     <CustomTextField
                        disabled={isSubmitting}
                        control={control}
                        placeholder="Phone number"
                        name="phone"
                        label="Phone number"
                        InputLabelProps={{ shrink: true }}
                     />
                  </Grid>
               </Grid>
            </CardContent>
            <Divider />
            <Box
               sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  p: 2
               }}
            >
               <Button type="submit" color="primary" variant="contained" disabled={isSubmitting}>
                  Save details
               </Button>
            </Box>
         </Card>
      </form>
   )
}
export default AccountProfileDetails
