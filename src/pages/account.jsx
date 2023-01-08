import Head from 'next/head'
import { Box, Container, Grid, Typography } from '@mui/material'
import { AccountProfile } from 'components/account'
import AccountProfileDetails from 'components/account/account-profile-details'
import { ChangePasswordFormValues, User } from 'models'
import { SettingsPassword } from 'components/settings/settings-password'
import DashboardLayout from 'components/layouts/dashboard-layout'
import userApi from 'api/userApi'
import { useSnackbar } from 'notistack'

const Account = () => {
   // const { updateProfile } = useAuth()
   const { enqueueSnackbar } = useSnackbar()

   const handleUpdateAccount = async payload => {
      const { response, err } = await userApi.updateProfile(payload)
      if (err) {
         enqueueSnackbar(err.message, {
            variant: 'error'
         })
         return
      }
      enqueueSnackbar('Update profile successfully', {
         variant: 'success'
      })
   }

   const handleChangePassword = async payload => {
      console.log(payload)
      const { response, err } = await userApi.changePassword(payload)
      if (err) {
         enqueueSnackbar(err.message, {
            variant: 'error'
         })
         return
      }
      enqueueSnackbar('Change password successfully', {
         variant: 'success'
      })
   }

   return (
      <>
         <Head>
            <title>Account | FurnitureStore</title>
         </Head>
         <Box
            component="main"
            sx={{
               flexGrow: 1,
               py: 8
            }}
         >
            <Container maxWidth="lg">
               <Typography sx={{ mb: 3 }} variant="h4">
                  Account
               </Typography>
               <Grid container spacing={3}>
                  <Grid item lg={12} md={6} xs={12}>
                     <AccountProfileDetails onSubmit={handleUpdateAccount} />
                  </Grid>
                  <Grid item lg={12} md={6} xs={12}>
                     <SettingsPassword onSubmit={handleChangePassword} />
                     {/* <AccountProfile /> */}
                  </Grid>
               </Grid>
            </Container>
         </Box>
      </>
   )
}

Account.Layout = DashboardLayout

export default Account
