import type { Kysely } from 'kysely'

export async function seed(db: Kysely<any>): Promise<void> {
  await db.insertInto('category').values({ name: 'Clothing', description: 'Clothing' }).execute();
  await db.insertInto('category').values({ name: 'Shoes', description: 'Shoes' }).execute();
  await db.insertInto('category').values({ name: 'Accessories', description: 'Accessories' }).execute();
  await db.insertInto('category').values({ name: 'Jewellery', description: 'Jewellery' }).execute();
  await db.insertInto('category').values({ name: 'Watches', description: 'Watches' }).execute();
  await db.insertInto('category').values({ name: 'Bags', description: 'Bags' }).execute();
  await db.insertInto('category').values({ name: 'Handbags', description: 'Handbags' }).execute();
  await db.insertInto('category').values({ name: 'Sunglasses', description: 'Sunglasses' }).execute();
  await db.insertInto('category').values({ name: 'Sneakers', description: 'Sneakers' }).execute();
  await db.insertInto('category').values({ name: 'Boots', description: 'Boots' }).execute();
  await db.insertInto('category').values({ name: 'Sandals', description: 'Sandals' }).execute();
  await db.insertInto('category').values({ name: 'Socks', description: 'Socks' }).execute();
  await db.insertInto('category').values({ name: 'Gloves', description: 'Gloves' }).execute();
  await db.insertInto('category').values({ name: 'Hats', description: 'Hats' }).execute();
  await db.insertInto('category').values({ name: 'Ties', description: 'Ties' }).execute();
  await db.insertInto('category').values({ name: 'Jackets', description: 'Jackets' }).execute();
  await db.insertInto('category').values({ name: 'Belts', description: 'Belts' }).execute();
  await db.insertInto('category').values({ name: 'Wallets', description: 'Wallets' }).execute();
}
