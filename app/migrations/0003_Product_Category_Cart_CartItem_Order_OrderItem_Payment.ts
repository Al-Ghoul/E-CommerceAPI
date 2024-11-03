import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Categories
  await db.schema
    .createTable("category")
    .addColumn("id", "bigserial", (col) => col.primaryKey())
    .addColumn("name", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("icon", "varchar(255)", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  // Sub Categories
  await db.schema
    .createTable("subcategory")
    .addColumn("id", "bigserial", (col) => col.primaryKey())
    .addColumn("name", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("category_id", "bigint", (col) =>
      col.references("category.id").onDelete("cascade").notNull(),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  // Products
  await db.schema
    .createTable("product")
    .addColumn("id", "bigserial", (col) => col.primaryKey())
    .addColumn("name", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("price", "decimal(10, 2)", (col) => col.notNull())
    .addColumn("stock_quantity", "numeric", (col) => col.notNull())
    .addColumn("subcategory_id", "bigint", (col) =>
      col.references("subcategory.id").onDelete("cascade").notNull(),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  // Carts
  await db.schema
    .createType("cart_status")
    .asEnum(["active", "archived", "checked_out"])
    .execute();

  await db.schema
    .createTable("cart")
    .addColumn("id", "bigserial", (col) => col.primaryKey())
    .addColumn("user_id", "bigint", (col) =>
      col.references("user.id").onDelete("cascade").notNull(),
    )
    .addColumn("status", sql`cart_status`, (col) => col.notNull())
    .addColumn("checked_out_at", "timestamp")
    .addColumn("archived_at", "timestamp")
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  // Cart Items
  await db.schema
    .createTable("cart_item")
    .addColumn("id", "bigserial", (col) => col.primaryKey())
    .addColumn("cart_id", "bigint", (col) =>
      col.references("cart.id").onDelete("cascade").notNull(),
    )
    .addColumn("product_id", "bigint", (col) =>
      col.references("product.id").onDelete("cascade").notNull(),
    )
    .addColumn("quantity", "numeric", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  // Orders
  await db.schema
    .createType("order_status")
    .asEnum(["failed", "success"])
    .execute();

  await db.schema
    .createType("fulfillment_status")
    .asEnum(["pending", "shipped", "delivered", "canceled"])
    .execute();

  await db.schema
    .createTable("order")
    .addColumn("id", "bigserial", (col) => col.primaryKey())
    .addColumn("cart_id", "bigint", (col) =>
      col.references("cart.id").onDelete("cascade").notNull().unique(),
    )
    .addColumn("user_id", "bigint", (col) =>
      col.references("user.id").onDelete("cascade").notNull(),
    )
    .addColumn("total_amount", "numeric", (col) => col.notNull())
    .addColumn("status", sql`order_status`)
    .addColumn("fulfillment_status", sql`fulfillment_status`, (col) =>
      col.notNull(),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  // Order Items
  await db.schema
    .createTable("order_item")
    .addColumn("id", "bigserial", (col) => col.primaryKey())
    .addColumn("order_id", "bigint", (col) =>
      col.references("order.id").onDelete("cascade").notNull(),
    )
    .addColumn("product_id", "bigint", (col) =>
      col.references("product.id").onDelete("cascade").notNull(),
    )
    .addColumn("quantity", "numeric", (col) => col.notNull())
    .addColumn("price_at_purchase", "decimal(10, 2)", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  // Payment
  await db.schema
    .createType("payment_status")
    .asEnum(["paid", "pending", "failed", "processing", "refunded", "canceled"])
    .execute();

  await db.schema
    .createType("payment_method_type")
    .asEnum(["credit_card", "cod", "paypal"])
    .execute();

  await db.schema
    .createTable("payment_info")
    .addColumn("id", "bigserial", (col) => col.primaryKey())
    .addColumn("order_id", "bigint", (col) =>
      col.references("order.id").onDelete("cascade").notNull().unique(),
    )
    .addColumn("method", sql`payment_method_type`, (col) => col.notNull())
    .addColumn("status", sql`payment_status`, (col) =>
      col.notNull().defaultTo("processing"),
    )
    .addColumn("provider", "varchar(255)", (col) => col.notNull())
    .addColumn("customer_reference_id", "varchar(255)")
    .addColumn("transaction_id", "varchar(255)", (col) => col.notNull())
    .addColumn("amount", "decimal(10, 2)", (col) => col.notNull())
    .addColumn("currency", "char(3)", (col) => col.notNull().defaultTo("USD"))
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await db.schema
    .createTable("card_info")
    .addColumn("id", "bigserial", (col) => col.primaryKey())
    // card number/cvc should be encrypted
    .addColumn("card_number", "varchar(255)", (col) => col.notNull())
    .addColumn("card_cvv", "varchar(255)", (col) => col.notNull())
    .addColumn("card_holder", "varchar(255)", (col) => col.notNull())
    .addColumn("card_expiry", "varchar(255)", (col) => col.notNull())
    .addColumn("payment_info_id", "bigint", (col) =>
      col.references("payment_info.id").onDelete("cascade").notNull(),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await db.schema
    .createTable("paypal_info")
    .addColumn("id", "bigserial", (col) => col.primaryKey())
    .addColumn("email", "varchar(255)", (col) => col.notNull())
    .addColumn("payment_info_id", "bigint", (col) =>
      col.references("payment_info.id").onDelete("cascade").notNull(),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await db.schema
    .createType("shipping_status")
    .asEnum(["pending", "in_transit", "delivered", "returned"])
    .execute();

  await db.schema
    .createTable("shipping_info")
    .addColumn("id", "bigserial", (col) => col.primaryKey())
    .addColumn("order_id", "bigint", (col) =>
      col.references("order.id").onDelete("cascade").notNull().unique(),
    )
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("address", "varchar(255)", (col) => col.notNull())
    .addColumn("city", "varchar(255)", (col) => col.notNull())
    .addColumn("country", "varchar(255)", (col) => col.notNull())
    .addColumn("postal_code", "varchar(255)", (col) => col.notNull())
    .addColumn("tracking_number", "varchar(255)") // For tracking shipments
    .addColumn("status", sql`shipping_status`, (col) =>
      col.defaultTo("pending").notNull(),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("order_item").execute();
  await db.schema.dropTable("cart_item").execute();
  await db.schema.dropTable("product").execute();
  await db.schema.dropTable("subcategory").execute();
  await db.schema.dropTable("category").execute();
  await db.schema.dropTable("card_info").execute();
  await db.schema.dropTable("paypal_info").execute();
  await db.schema.dropTable("payment_info").execute();
  await db.schema.dropTable("shipping_info").execute();
  await db.schema.dropTable("order").execute();
  await db.schema.dropTable("cart").execute();

  await db.schema.dropType("order_status").execute();
  await db.schema.dropType("payment_status").execute();
  await db.schema.dropType("cart_status").execute();
  await db.schema.dropType("fulfillment_status").execute();
  await db.schema.dropType("payment_method_type").execute();
  await db.schema.dropType("shipping_status").execute();
}
