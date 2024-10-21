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

| URI                  |                    Description                     | Method |
| :------------------- | :------------------------------------------------: | :----- |
| /api/users           |               Registers a new user.                | POST   |
| /api/auth/login      |                  Logs in a user.                   | POST   |
| /api/auth/refresh    |                  Refresh a token.                  | POST   |
| /api/categories      | Get all categories. paginated with limit & offset. | GET    |
| /api/categories      |              Creates a new category.               | POST   |
| /api/categories/{id} |                Updates a category.                 | PATCH  |
| /api/categories/{id} |                  Deletes a category.                   | DELETE |
| /api/products      | Get all products. paginated with limit & offset. | GET    |
| /api/products      |              Creates a new product.               | POST   |
| /api/products/{id} |                Updates a product.                 | PATCH  |
| /api/products/{id} |                  Deletes a product.                   | DELETE |



## Technology stack

- [Next.js](https://nextjs.org/)
- [Nix](https://nixos.org/nix/)
