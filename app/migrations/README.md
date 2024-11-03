# Logical Data Model

The following LDM(s) represents the current state of the database.

```mermaid
%%{init: {'theme':'dark'}}%%
erDiagram


USER ||--}o ACCOUNT : has
USER ||--}o TOKEN : has
USER ||--}o CART : has
USER ||--}o ORDER : has

CATEGORY ||--o{ SUBCATEGORY : "has"
SUBCATEGORY ||--o{ PRODUCT : "has"

ORDER ||--|| PAYMENT_INFO : has
ORDER ||--}o ORDER_ITEM : has
ORDER ||--|| SHIPPING_INFO : has

PRODUCT ||--}o CART_ITEM : has
PRODUCT ||--}o ORDER_ITEM : has

CART ||--}o CART_ITEM : has
CART ||--|| ORDER : has

CARD_INFO ||--}o PAYMENT_INFO : has
PAYPAL_INFO ||--}o PAYMENT_INFO : has




USER {
    INTEGER id PK
    VARCHAR(50) email
    VARCHAR(50) first_name
    VARCHAR(50) last_name
    DATETIME emailVerified
    VARCHAR(255) image
    DATETIME created_at
    DATETIME updated_at
}

ACCOUNT {
   INTEGER id PK
   VARCHAR(255) password
   INTEGER user_id FK
   VARCHAR(50) type
   VARCHAR(50) provider
   VARCHAR(50) providerAccount_id
   TEXT refresh_token
   TEXT access_token
   TEXT id_token
   BIGINTEGER expires_in
   VARCHAR(255) scope
   DATETIME created_at
   DATETIME updated_at
}

TOKEN {
   INTEGER id PK
   INTEGER user_id FK
   TEXT token
   ENUM type  "access, refresh"
   ENUM status  "valid, expired, revoked"
   DATETIME expires_in
   DATETIME created_at
   DATETIME updated_at
}


CATEGORY {
   INTEGER id PK
   VARCHAR(255) name
   TEXT description
   DATETIME created_at
   DATETIME updated_at
}

SUBCATEGORY {
    INTEGER id PK
    VARCHAR name
    TEXT description
    INTEGER category_id FK
    DATETIME created_at
    DATETIME updated_at
}


PRODUCT {
   INTEGER id PK
   VARCHAR(255) name
   TEXT description
   DECIMAL price
   INTEGER stock_quantity
   INTEGER subcategory_id FK
   DATETIME created_at
   DATETIME updated_at
}

CART {
   INTEGER id PK
   INTEGER user_id FK
   ENUM status "active, inactive, checked_out"
   DATETIME checked_out_at
   DATETIME archived_at
   DATETIME created_at
   DATETIME updated_at
}

CART_ITEM {
   INTEGER id PK
   INTEGER cart_id FK
   INTEGER product_id FK
   INTEGER quantity
   DATETIME created_at
   DATETIME updated_at
}

ORDER {
   INTEGER id PK
   INTEGER user_id FK
   INTEGER cart_id FK
   INTEGER total_amount
   ENUM status "failed, success"
   ENUM fulfillment_status "pending, shipped, delivered, canceled"
   DATETIME created_at
   DATETIME updated_at
}

ORDER_ITEM {
   INTEGER id PK
   INTEGER order_id FK
   INTEGER product_id FK
   INTEGER quantity
   DECIMAL price_at_purchase
   DATETIME created_at
   DATETIME updated_at
}

PAYMENT_INFO {
   INTEGER id PK
   INTEGER order_id FK
   ENUM method "credit_card, cod, paypal"
   ENUM status "paid, pending, failed, processing, refunded, canceled"
   VARCHAR(255) provider
   VARCHAR(255) customer_reference_id
   VARCHAR(255) transaction_id
   DECIMAL amount
   VARCHAR(3) currency
   DATETIME created_at
   DATETIME updated_at
}

CARD_INFO {
   INTEGER id PK
   INTEGER payment_info_id FK
   VARCHAR(255) card_holder
   VARCHAR(255) card_cvv
   VARCHAR(255) card_number
   VARCHAR(255) card_expiry
   DATETIME created_at
   DATETIME updated_at
}

PAYPAL_INFO {
   INTEGER id PK
   INTEGER payment_info_id FK
   VARCHAR(255) email
   DATETIME created_at
   DATETIME updated_at
}

SHIPPING_INFO {
   INTEGER id PK
   INTEGER order_id FK
   VARCHAR(255) name
   VARCHAR(255) address
   VARCHAR(255) city
   VARCHAR(255) country
   VARCHAR(255) postal_code
   VARCHAR(255) tracking_number
   ENUM status "pending, in_transit, delivered, returned"
   DATETIME created_at
   DATETIME updated_at
}


```
