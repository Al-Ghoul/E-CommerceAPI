import { Product } from "kysely-codegen";
export { };

declare global {
  interface BigInt {
    toJSON(): number;
  }
  // @ts-expect-error override types just for this page
  interface CategoryProduct extends Product {
    id: string;
    subcategory_name: string;
    price: string;
    category_name: string;
  }

  interface UserData {
    isAuthenticated: boolean;
    userId: string | undefined;
  }

  interface CartItemWithPrice {
    id: number;
    price: number;
    quantity: number;
    name: string;
    description: string;
  }

  interface Order {
    id: string;
    created_at: string;
    fulfillment_status: "pending" | "shipped" | "delivered" | "canceled";
    total_amount: string;
    updated_at: string;
    user_id: string;
    cart_id: string;
  }

  interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price_at_purchase: float;
  }

  interface Error {
    detail: string;
    message: string;
    statusCode: number;
  }
}
