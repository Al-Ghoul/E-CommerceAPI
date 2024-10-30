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
}
