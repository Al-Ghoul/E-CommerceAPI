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

| URI                           |                    Description                     | Method |
| :---------------------------- | :------------------------------------------------: | :----- |
| /api/users                    |               Registers a new user.                | POST   |
| /api/auth/login               |                  Logs in a user.                   | POST   |
| /api/auth/refresh             |                  Refresh a token.                  | POST   |
| /api/categories               | Get all categories. paginated with limit & offset. | GET    |
| /api/categories               |              Creates a new category.               | POST   |
| /api/categories/{id}          |               Get a single category.               | GET    |
| /api/categories/{id}          |                Updates a category.                 | PATCH  |
| /api/categories/{id}          |                Deletes a category.                 | DELETE |
| /api/categories/{id}/products |  Get all products. paginated with limit & offset.  | GET    |
| /api/categories/{id}/products |               Creates a new product.               | POST   |
| /api/products/{id}            |               Get a single product.                | GET    |
| /api/products/{id}            |                 Updates a product.                 | PATCH  |
| /api/products/{id}            |                 Deletes a product.                 | DELETE |
| /api/users/{id}/cart          |                   Get user cart.                   | GET    |
| /api/users/{id}/cart          |                Create a user cart.                 | POST   |
| /api/carts/{id}               |                   Delete a cart.                   | DELETE |
| /api/carts/{id}               |                   Update a cart.                   | PATCH  |

## Technology stack

- [Next.js](https://nextjs.org/)
- [Nix](https://nixos.org/nix/)
