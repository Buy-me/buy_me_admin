import {
   Box,
   Button,
   Container,
   Divider,
   Pagination,
   Paper,
   Tab,
   Tabs,
   Typography
} from '@mui/material'
import ProductList from 'components/product/product-list'
import { ProductListToolbar } from 'components/product'
import ProductAddEditModal from 'components/product/product-add-edit-modal'
import Head from 'next/head'
import { useSnackbar } from 'notistack'
import { useEffect, useRef, useState } from 'react'
import DashboardLayout from 'components/layouts/dashboard-layout'
import foodApi from 'api/foodApi'

const DEFAULT_PAGINATION = {
   total_items: 10,
   total: 1,
   page: 1,
   limit: 10
}

const Products = () => {
   const { enqueueSnackbar } = useSnackbar()
   const [productList, setProductList] = useState([])
   const [pagination, setPagination] = useState(DEFAULT_PAGINATION)
   const [filters, setFilters] = useState({
      search: '',
      orderBy: 'updated_at desc'
   })
   useEffect(() => {
      const getFoods = async () => {
         const { response, err } = await foodApi.getList(pagination, filters)
         if (err) {
            enqueueSnackbar(err.message, {
               variant: 'error'
            })
            return
         }
         console.log(response.paging)
         setProductList(response.data)
         setPagination({ ...response.paging, total_items: response.data.length })
      }

      getFoods()
   }, [pagination.page, pagination.limit, pagination.total, filters.search])

   const [isEdit, setIsEdit] = useState(false)
   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
   const [editProduct, setEditProduct] = useState()
   const productListTitleRef = useRef(null)
   const executeScroll = () => {
      if (productListTitleRef.current) productListTitleRef.current.scrollIntoView()
   }

   const handleAddEditProduct = async product => {
      console.log(product)
      if (editProduct?.id) {
         const { response, err } = await foodApi.update(editProduct?.id, {
            name: product.title,
            category_id: product.categories,
            price: product.price,
            images: product.avatar,
            description: product.desc
         })

         if (err) {
            enqueueSnackbar(err.message, {
               variant: 'error'
            })
         }

         enqueueSnackbar('Update successfully', {
            variant: 'success'
         })
      } else {
         const { response, err } = await foodApi.create({
            name: product.title,
            category_id: product.categories,
            price: product.price,
            images: product.avatar,
            description: product.desc
         })

         if (err) {
            enqueueSnackbar(err.message, {
               variant: 'error'
            })
         }

         enqueueSnackbar('Create successfully', {
            variant: 'success'
         })
      }

      const { response, err } = await foodApi.getList(pagination, filters)
      if (err) {
         enqueueSnackbar(err.message, {
            variant: 'error'
         })
         return
      }
      setProductList(response.data)
      setPagination({ ...response.paging, total_items: response.data.length })

      setIsEditModalOpen(false)
      // setEditProduct(undefined)
   }

   const handleDeleteProduct = async id => {
      // try {
      //    await productApi.delete(id).then(res => {
      //       if (!productList) return
      //       const newProductList = productList.filter(product => product._id !== id)
      //       mutate(newProductList, true)
      //       enqueueSnackbar(res.message, {
      //          variant: 'success'
      //       })
      //    })
      // } catch (error: any) {
      //    enqueueSnackbar(error.message, {
      //       variant: 'error'
      //    })
      // }
   }

   const handleCloseAddEditModal = () => {
      setIsEditModalOpen(false)
      setEditProduct(undefined)
   }

   const handleChangeTab = (event, newValue) => {
      setPagination(DEFAULT_PAGINATION)
      setFilters({
         ...filters,
         inStock: newValue
      })
   }

   const handleChangePagination = (event, value) => {
      executeScroll()
      setPagination({
         ...pagination,
         page: value
      })
   }

   const handleSearch = search => {
      setPagination(DEFAULT_PAGINATION)
      setFilters({
         ...filters,
         search
      })
   }

   const handleChangeSorting = orderBy => {
      setPagination(DEFAULT_PAGINATION)
      setFilters({
         ...filters,
         orderBy
      })
   }

   return (
      <>
         <Head>
            <title>Products | FurnitureStore</title>
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
                  <Typography sx={{ m: 1 }} variant="h4" ref={productListTitleRef}>
                     Products
                  </Typography>
                  <Box sx={{ m: 1 }}>
                     {/* <Button startIcon={<DownloadIcon fontSize="small" />} sx={{ mr: 1 }}>
                        Import
                     </Button>
                     <Button startIcon={<UploadIcon fontSize="small" />} sx={{ mr: 1 }}>
                        Export
                     </Button> */}
                     <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                           setIsEdit(false)
                           setIsEditModalOpen(true)
                        }}
                     >
                        Add products
                     </Button>
                  </Box>
               </Box>

               <Paper sx={{ mt: 1 }}>
                  {/* <Tabs value={filters.inStock} onChange={handleChangeTab}>
                     <Tab label="All" value="" />
                     <Tab label="Available" value="true" />
                     <Tab label="Out of stock" value="false" />
                  </Tabs> */}
                  <Divider />
                  <ProductListToolbar
                     filters={filters}
                     onSearch={handleSearch}
                     onChangeSorting={handleChangeSorting}
                  />
               </Paper>
               <ProductList
                  products={productList}
                  pagination={pagination}
                  onEditClick={product => {
                     setIsEditModalOpen(true)
                     setEditProduct(product)
                     setIsEdit(true)
                  }}
                  onDeleteClick={handleDeleteProduct}
               />

               {productList && productList.length > 0 && (
                  <Box
                     sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        pt: 3
                     }}
                  >
                     <Pagination
                        color="primary"
                        count={Math.ceil(pagination.total / pagination.limit)}
                        page={pagination.page}
                        onChange={handleChangePagination}
                     />
                  </Box>
               )}

               <ProductAddEditModal
                  isEdit={isEdit}
                  data={editProduct}
                  isOpen={isEditModalOpen}
                  onClose={handleCloseAddEditModal}
                  onSubmit={handleAddEditProduct}
               />
            </Container>
         </Box>
      </>
   )
}

Products.Layout = DashboardLayout

export default Products
