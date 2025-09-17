// types.ts
export interface Order {
  id: string;
  customerName: string;
  email: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  date: string;
  items: {
    productId: number;
    name: string;
    quantity: number;
    price: number;
  }[];
}

export interface Product {
  id?: string;
  name: string;
  category: string;
  image?: string;
  featured: boolean;
  rating?: number;
  reviews?: number;
  source_place?: string; 
  vendor?: string;       
  created_at?: string;
}

export interface ProductVariant {
  id?: string;
  product_id?: string;
  size: string;
  color: string;
  stock: number;
  original_price: number;
  discount: number;
  price?: number;
  sku?: string;
  created_at?: string;
}


export interface Customer {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  notes?: string;
}
