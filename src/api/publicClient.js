import axios from 'axios'
import queryString from 'query-string'

// Add to env
const baseURL = 'http://146.190.98.185:8080'
const version = '/v1'

const publicClient = axios.create({
   baseURL: baseURL + version
})

publicClient.interceptors.request.use(async config => {
   return {
      headers: {
         'Content-Type': 'application/json'
      },
      ...config
   }
})

publicClient.interceptors.response.use(
   response => {
      if (response && response.data) return response.data
      return response
   },
   err => {
      throw err.response.data
   }
)

export default publicClient
