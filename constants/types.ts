export interface Destination {
  id: number;
  images: string[] | [];
  thumbnail_image?: string;
  video_url?: string;
  title: string;
  slug: string;
  minimum_pax: number;
  inclusions: string[] | [];
  inventory: string[] | [];
  description: string;
  duration: number;
  price: number;
  average_rating: number;
  review_count?: number | string;
  category_id: number;
  category_name: string;
  location?: string;
}

export interface Env {
  serviceId: string;
  publicKey: string;
  authToken: string;
}

export interface Booking {
  id: number;
  name: string;
  email: string;
  booking_date: string;
  status:
    | "pending"
    | "confirmed"
    | "paid"
    | "ongoing"
    | "complete"
    | "canceled";
  pax: number;
  destination_id: number;
  destination_title: string;
  destination_duration: number;
  destination_inclusions: string[];
  destination_price: number;
  subtotal: number;
  tax: number;
  tax_rate: number;
  total: number;
  created_at: string;
  updated_at: string;
  pickup_location: string;
  payment_proof: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Review {
  id: number;
  user_name: string;
  rating: number;
  destination_id: number;
  destination_title: string;
  created_at: string;
  comments: string;
}
export interface PaymentProof {
  id: string;
  image_url: string;
}

export interface Options {
  value: string;
  label: string;
}

export interface User {
  username: string;
  password: string;
}

export interface Auth {
  authToken: string;
  authUser: string;
}
