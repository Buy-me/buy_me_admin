import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import {
   Box,
   Button,
   Card,
   CardHeader,
   Divider,
   List,
   ListItem,
   ListItemAvatar,
   ListItemText,
   Skeleton
} from '@mui/material'
import foodApi from 'api/foodApi'
import { formatDistance, parseISO } from 'date-fns'
import { Product } from 'models'
import NextLink from 'next/link'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

const NUMBER_PRODUCTS = 6

const DEFAULT_PAGINATION = {
   total_items: 5,
   total: 1,
   page: 1,
   limit: 5
}

const ProductSkeleton = ({ numberProducts }) => (
   <List>
      {Array.from(new Array(numberProducts)).map((product, index) => (
         <ListItem divider={index < NUMBER_PRODUCTS - 1} key={index}>
            <ListItemAvatar>
               <Skeleton variant="rectangular" width={48} height={48} />
            </ListItemAvatar>
            <ListItemText
               primary={<Skeleton variant="text" />}
               secondary={<Skeleton variant="text" />}
            />
         </ListItem>
      ))}
   </List>
)

const LatestProducts = props => {
   const [products, seyProducts] = useState([])
   const [pagination, setPagination] = useState(DEFAULT_PAGINATION)
   const { enqueueSnackbar } = useSnackbar()
   useEffect(() => {
      const getFoods = async () => {
         const { response, err } = await foodApi.getList(pagination, {
            orderBy: 'created_at desc'
         })
         if (err) {
            enqueueSnackbar(err.message, {
               variant: 'error'
            })
            return
         }
         console.log(response.paging)
         seyProducts(response.data)
      }

      getFoods()
   }, [pagination.page, pagination.limit, pagination.total])

   return (
      <Card {...props}>
         <CardHeader
            subtitle={`${products ? products.length : 0} in total`}
            title="Latest Products"
         />
         <Divider />
         {products ? (
            <List>
               {products.map((product, i) => (
                  <ListItem divider={i < products.length - 1} key={product.id}>
                     <ListItemAvatar>
                        <img
                           alt={product.name}
                           src={product.images?.url}
                           style={{
                              height: 48,
                              width: 48
                           }}
                        />
                     </ListItemAvatar>
                     <ListItemText
                        primary={product.name}
                        secondary={`Updated ${formatDistance(
                           parseISO(product.updated_at),
                           new Date(),
                           { addSuffix: true }
                        )}`}
                     />
                  </ListItem>
               ))}
            </List>
         ) : (
            <ProductSkeleton numberProducts={NUMBER_PRODUCTS} />
         )}
         <Divider />
         <Box
            sx={{
               display: 'flex',
               justifyContent: 'flex-end',
               p: 2
            }}
         >
            <NextLink href={'/products'} passHref legacyBehavior>
               <Button color="primary" endIcon={<ArrowRightIcon />} size="small" variant="text">
                  View all
               </Button>
            </NextLink>
         </Box>
      </Card>
   )
}

export default LatestProducts
