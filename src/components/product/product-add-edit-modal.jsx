import {
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   InputAdornment,
   Box,
   CardMedia,
   Avatar,
   TextField
} from '@mui/material'
import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { CustomSelectField, CustomTextField } from 'components/form-controls'
import { LoadingButton } from '@mui/lab'
import categoryApi from 'api/categoryApi'
import DropFileInput from 'components/file-upload/file-upload'
import foodApi from 'api/foodApi'
import { useSnackbar } from 'notistack'

const schema = yup.object({
   title: yup.string().max(255).required(),
   desc: yup.string().max(255).required(),
   price: yup
      .number()
      .test('is-decimal', 'invalid decimal', value => (value + '').match(/^[+-]?\d+(\.\d+)?$/)),
   quantity: yup.number().integer().min(0)
})

const ProductAddEditModal = ({ isOpen, isEdit, data, onClose, onSubmit }) => {
   const [file, setFile] = useState(null)
   const { enqueueSnackbar } = useSnackbar()
   const [categories, setCategories] = useState([])

   useEffect(() => {
      const getCategories = async () => {
         const { response, err } = await categoryApi.getList()
         setCategories(response.data)
      }
      getCategories()
   }, [])

   const form = useForm({
      defaultValues: {
         title: '',
         desc: '',
         img: '',
         categories: '',
         price: undefined,
         quantity: undefined
      },
      resolver: yupResolver(schema)
   })

   const {
      reset,
      control,
      formState: { isSubmitting }
   } = form

   const handleSaveProduct = async values => {
      let avatar = null
      if (file !== null) {
         const { response, err } = await foodApi.upload({
            file: file
         })
         if (err) {
            enqueueSnackbar(err.message, {
               variant: 'error'
            })
            return
         } else {
            console.log('image', response.data)
            avatar = response.data
         }
      }
      if (onSubmit) await onSubmit({ ...values, avatar: avatar })
   }

   useEffect(() => {
      if (isEdit) {
         reset({
            title: data?.name || '',
            desc: data?.description || '',
            categories: data?.category_id || '',
            price: data?.price,
            quantity: data?.quantity
         })
      } else {
         reset({
            title: '',
            desc: '',
            categories: '',
            price: undefined,
            quantity: undefined
         })
      }
   }, [data, reset, isEdit])

   const handleClose = () => {
      onClose()
      reset()
   }

   const onFileChange = (files, haveEdit) => {
      //fromEdit == false => thi set iamge
      console.log(files, haveEdit)
      if (isEdit) {
         if (haveEdit) setFile(files[0])
      } else {
         setFile(files[0])
      }
   }

   return (
      <Dialog open={isOpen} onClose={handleClose} scroll="body">
         <DialogTitle>Product</DialogTitle>
         <DialogContent>
            <form>
               <DropFileInput onFileChange={onFileChange} isEdit={isEdit} data={data} />
               <CustomTextField
                  disabled={isSubmitting}
                  control={control}
                  name="title"
                  label="Product Title"
               />
               <CustomTextField
                  disabled={isSubmitting}
                  control={control}
                  name="desc"
                  label="Description"
                  multiline={true}
                  rows={4}
               />
               {/* <CustomTextField
                  disabled={isSubmitting}
                  control={control}
                  name="img"
                  label="Image Link"
               /> */}
               <CustomSelectField
                  control={control}
                  name="categories"
                  label="Categories"
                  disabled={isSubmitting}
                  options={
                     categories
                        ? categories.map(item => ({
                             value: item.id,
                             label: item.name
                          }))
                        : []
                  }
               />
               <CustomTextField
                  control={control}
                  name="price"
                  label="Price"
                  InputProps={{
                     startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
               />
               <CustomTextField control={control} name="quantity" label="Quantity" />
            </form>
         </DialogContent>
         <DialogActions>
            <Button disabled={isSubmitting} onClick={onClose}>
               Cancel
            </Button>
            <LoadingButton
               loading={isSubmitting}
               type="submit"
               variant="contained"
               onClick={form.handleSubmit(handleSaveProduct)}
            >
               Save
            </LoadingButton>
         </DialogActions>
      </Dialog>
   )
}

export default ProductAddEditModal
