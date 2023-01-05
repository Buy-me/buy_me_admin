import {
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   InputAdornment
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Category, Product, ProductPayload } from 'models'
import { CustomSelectField, CustomTextField } from 'components/form-controls'
import { LoadingButton } from '@mui/lab'
import useSWR from 'swr'
import categoryApi from 'api/categoryApi'

const schema = yup.object({
   title: yup.string().max(255).required(),
   desc: yup.string().max(255).required(),
   img: yup.string().max(255).required(),
   price: yup.number().integer().min(0),
   quantity: yup.number().integer().min(0)
})

const ProductAddEditModal = ({ isOpen, isEdit, data, onClose, onSubmit }) => {
   // const { data: options = [] } = useSWR('categories', {
   //    dedupingInterval: 60 * 60 * 1000, // 1hr
   //    revalidateOnFocus: false,
   //    revalidateOnMount: true
   // })
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
         categories: [],
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
      if (onSubmit) await onSubmit(values)
   }

   useEffect(() => {
      console.log(data)
      if (isEdit) {
         reset({
            title: data?.name || '',
            desc: data?.description || '',
            img: data?.images.url || '',
            categories: data?.category_id || [],
            price: data?.price,
            quantity: data?.quantity
         })
      } else {
         reset({
            title: '',
            desc: '',
            img: '',
            categories: [],
            price: undefined,
            quantity: undefined
         })
      }
   }, [data, reset, isEdit])

   const handleClose = () => {
      onClose()
      reset()
   }

   return (
      <Dialog open={isOpen} onClose={handleClose} scroll="body">
         <DialogTitle>Product</DialogTitle>
         <DialogContent>
            <form>
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
               <CustomTextField
                  disabled={isSubmitting}
                  control={control}
                  name="img"
                  label="Image Link"
               />
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
