import privateClient from './client'
import publicClient from './publicClient'

const foodEndpoints = {
   create: '/foods',
   update: id => `/foods/${id}`,
   list: '/foods',
   get: foodId => `/foods/${foodId}`,
   rating: foodId => `/foods/${foodId}/rating`,
   listRatingFood: foodId => `/foods/${foodId}/rating/list`,
   upload: '/upload'
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
   },
   create: async data => {
      try {
         const response = await privateClient.post(foodEndpoints.create, data)
         return { response }
      } catch (err) {
         return { err }
      }
   },
   upload: async data => {
      let formData = new FormData()
      formData.append('file', data.file)
      formData.append('folder', data.folder || 'foods')
      try {
         const response = await publicClient.post(foodEndpoints.upload, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
         })
         return { response }
      } catch (err) {
         return { err }
      }
   },
   update: async (id, data) => {
      try {
         const response = await privateClient.patch(foodEndpoints.update(id), data)
         return { response }
      } catch (err) {
         return { err }
      }
   }
}

export default foodApi
