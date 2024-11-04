# E-Commerce API

E-Commerce API's a RESTful API for an E-Commerce platform.

Project URL: https://roadmap.sh/projects/ecommerce-api

For the DB ERD see [app/migrations/README.md](app/migrations/README.md)

## Development \[Nix\]

```bash
# Clone & cd into project
# Enter development shell
nix develop

# Run dev server
cd app && npm run dev
```

## Routes

| URI                                           |                                  Description                                   | Method |
| :-------------------------------------------- | :----------------------------------------------------------------------------: | :----- |
| /api/auth/login                               |                                Logs in a user.                                 | POST   |
| /api/auth/refresh                             |                               Refreshes a token.                               | POST   |
| /api/users                                    |                             Registers a new user.                              | POST   |
| /api/users/{user_id}/carts                    |                              Creates a user cart.                              | POST   |
| /api/users/{user_id}/carts                    |                               Gets a user cart.                                | GET    |
| /api/users/{user_id}/orders                   |                             Creates a user order.                              | POST   |
| /api/users/{user_id}/orders                   |                               Gets a user order.                               | GET    |
| /api/categories                               |              Gets all categories. paginated with limit & offset.               | GET    |
| /api/categories                               |                            Creates a new category.                             | POST   |
| /api/categories/search                        |                             Search for categories.                             | GET    |
| /api/categories/{category_id}                 |                            Gets a single category.                             | GET    |
| /api/categories/{category_id}                 |                              Updates a category.                               | PATCH  |
| /api/categories/{category_id}                 |                              Deletes a category.                               | DELETE |
| /api/categories/{category_id}/subcategories   | Gets all subcategories for a specific category. paginated with limit & offset. | GET    |
| /api/categories/{category_id}/subcategories   |                           Creates a new subcategory.                           | POST   |
| /api/categories/{category_id}/products        |   Gets all products for a specific category. paginated with limit & offset.    | GET    |
| /api/categories/{category_id}/products/search |                  Search for products in a specific category.                   | GET    |
| /api/subcategories                            |             Gets all subcategories. paginated with limit & offset.             | GET    |
| /api/subcategories/{subcategory_id}           |                          Gets a single sub category.                           | GET    |
| /api/subcategories/{subcategory_id}           |                            Updates a sub category.                             | PATCH  |
| /api/subcategories/{subcategory_id}           |                            Deletes a sub category.                             | DELETE |
| /api/subcategories/{subcategory_id}/products  | Gets all subcategories for a specific category. paginated with limit & offset. | GET    |
| /api/subcategories/{subcategory_id}/products  |                             Creates a new product.                             | POST   |
| /api/products                                 |               Gets all products. paginated with limit & offset.                | GET    |
| /api/products/search                          |                              Search for products.                              | GET    |
| /api/products/{product_id}                    |                             Gets a single product.                             | GET    |
| /api/products/{product_id}                    |                               Updates a product.                               | PATCH  |
| /api/products/{product_id}                    |                               Deletes a product.                               | DELETE |
| /api/users/{user_id}/cart                     |                                Gets user cart.                                 | GET    |
| /api/users/{user_id}/cart                     |                              Creates a user cart.                              | POST   |
| /api/carts/{cart_id}                          |                                Deletes a cart.                                 | DELETE |
| /api/carts/{cart_id}                          |                                Updates a cart.                                 | PATCH  |
| /api/carts/{cart_id}/items                    |                               Creates cart item.                               | POST   |
| /api/carts/{cart_id}/items                    |                                Gets cart items.                                | GET    |
| /api/carts/{cart_id}/items/{item_id}          |                               Updates cart item.                               | PATCH  |
| /api/carts/{cart_id}/items/{item_id}          |                               Deletes cart item.                               | DELETE |
| /api/orders/{order_id}                        |                                 Gets an order.                                 | GET    |
| /api/orders/{order_id}                        |                               Deletes an order.                                | DELETE |
| /api/orders/{order_id}/items                  |                               Gets order items.                                | GET    |
| /api/orders/{order_id}/payment                |                          Creates order payment info.                           | POST   |
| /api/orders/{order_id}/shipping               |                          Creates order shipping info.                          | POST   |

## Technology stack

- [Next.js](https://nextjs.org/)
- [Nix](https://nixos.org/nix/)
