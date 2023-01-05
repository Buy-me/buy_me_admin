import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { PaginationParams, Product } from 'models'
import React from 'react'
import { renderPaginationText } from 'utils'
import ProductCard from './product-card'

const ProductList = ({ products, pagination, onEditClick, onDeleteClick }) => {
   return (
      <Box sx={{ pt: 3 }}>
         {products &&
            (products.length > 0 ? (
               <Typography variant="body1" sx={{ mb: 2 }}>
                  {renderPaginationText(pagination)}
               </Typography>
            ) : (
               <Box
                  sx={{
                     my: 20,
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center'
                  }}
               >
                  <Typography variant="h5">
                     No product found. Please try again with new filters and search keyword.
                  </Typography>
               </Box>
            ))}
         <Grid container spacing={3}>
            {products
               ? products.map(product => (
                    <Grid item key={product.id} lg={3} md={4} sm={6} xs={12}>
                       <ProductCard
                          product={product}
                          onEditClick={onEditClick}
                          onDeleteClick={onDeleteClick}
                       />
                    </Grid>
                 ))
               : Array.from(new Array(pagination.pageSize)).map((item, idx) => (
                    <Grid item key={idx} lg={3} md={4} sm={6} xs={12}>
                       <ProductCard />
                    </Grid>
                 ))}
         </Grid>
      </Box>
   )
}

export default ProductList
