import { User } from 'models'

export interface Order {
   id: number
   status: 1 | 2 | 3 | 4 | 5
   created_at: string
   updated_at: string
   user_id: number
   name: string
   phone: string
   title_address: string
   detail_address: string
   total_price: number
   tracking_state: 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancel'
   items: ProductOrder[]
   type: string
}

export interface ProductOrder {
   id: number
   status: 1
   created_at: string
   updated_at: string
   order_id: number
   discount: number
   price: number
   quantity: number
   food_origin: {
      id: number
      restaurant_id: number
      category_id: number
      name: string
      images: {
         id: number
         url: string
         width: number
         height: number
         cloud_name: string
         extension: string
      }
      price: number
      description: string
   }
}
export interface DeliveryInfo {
   address: Address
   name: string
   phone: string
   email: string
}
export interface Address {
   street: string
   ward: string
   district: string
   province: string
}
export type EditOrderFormValues = {
   name: string,
   phone: string,
   detail_address: string,
   total_price: number,
   tracking_state: string,
}
