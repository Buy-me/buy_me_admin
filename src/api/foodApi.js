import privateClient from './client'

const foodEndpoints = {
   list: '/foods',
   get: foodId => `/foods/${foodId}`,
   rating: foodId => `/foods/${foodId}/rating`,
   listRatingFood: foodId => `/foods/${foodId}/rating/list`
}

const foodApi = {
   getList: async (pagination, filters) => {
      try {
         const response = await privateClient.get(foodEndpoints.list, {
            params: {
               limit: pagination.limit,
               page: pagination.page,
               search: filters.search,
               sort: filters.orderBy
            }
         })
         return { response }
      } catch (err) {
         return { err }
      }
   },
   // getList: async (params) => {
   //   console.log(params);
   //   try {
   //     const response = await privateClient.get(foodEndpoints.list, {
   //       params: {
   //         sort: params.sort,
   //         category_id: params.categoryId || 0,
   //         min_price: params.minPrice || 0,
   //         max_price: params.maxPrice || 0,
   //         search: params.search || "",
   //       },
   //     });
   //     return { response };
   //   } catch (err) {
   //     return { err };
   //   }
   // },
   rating: async (foodId, data) => {
      try {
         const response = await privateClient.post(foodEndpoints.rating(foodId), {
            ...data
         })
         return { response }
      } catch (err) {
         return { err }
      }
   },
   getRatingList: async foodId => {
      try {
         const response = await privateClient.get(foodEndpoints.listRatingFood(foodId))
         return { response }
      } catch (err) {
         return { err }
      }
   },
   get: async foodId => {
      try {
         const response = await privateClient.get(foodEndpoints.get(foodId))
         return { response }
      } catch (err) {
         return { err }
      }
   }
}

export default foodApi
