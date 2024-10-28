import type { Kysely } from "kysely";

export async function seed(db: Kysely<any>): Promise<void> {
  const categories = await db
    .selectFrom("category")
    .select(["id", "name"])
    .execute();

  // Create a mapping of category names to their IDs
  const categoryIdMap: Record<string, number> = {};
  categories.forEach((category) => {
    categoryIdMap[category.name] = category.id;
  });

  // Step 2: Define the subcategories using the categoryIdMap
  const subcategories = [
    // Electronics
    {
      name: "Mobile Phones",
      description: "Latest smartphones and accessories",
      category_id: categoryIdMap["Electronics"],
    },
    {
      name: "Computers",
      description: "Laptops, desktops, and accessories",
      category_id: categoryIdMap["Electronics"],
    },
    {
      name: "Cameras",
      description: "Digital cameras and accessories",
      category_id: categoryIdMap["Electronics"],
    },
    {
      name: "Headphones",
      description: "Wired and wireless headphones",
      category_id: categoryIdMap["Electronics"],
    },
    {
      name: "Wearable Tech",
      description: "Smartwatches and fitness trackers",
      category_id: categoryIdMap["Electronics"],
    },
    {
      name: "Gaming Consoles",
      description: "Latest gaming consoles and accessories",
      category_id: categoryIdMap["Electronics"],
    },

    // Clothing
    {
      name: "Men's Fashion",
      description: "Apparel for men",
      category_id: categoryIdMap["Clothing"],
    },
    {
      name: "Women's Fashion",
      description: "Apparel for women",
      category_id: categoryIdMap["Clothing"],
    },
    {
      name: "Kids",
      description: "Clothing for kids",
      category_id: categoryIdMap["Clothing"],
    },
    {
      name: "Shoes",
      description: "Footwear for all occasions",
      category_id: categoryIdMap["Clothing"],
    },
    {
      name: "Accessories",
      description: "Hats, belts, and other accessories",
      category_id: categoryIdMap["Clothing"],
    },
    {
      name: "Activewear",
      description: "Clothing for sports and fitness",
      category_id: categoryIdMap["Clothing"],
    },

    // Home & Garden
    {
      name: "Furniture",
      description: "Home furnishings and decor",
      category_id: categoryIdMap["Home & Garden"],
    },
    {
      name: "Decor",
      description: "Home decor and accessories",
      category_id: categoryIdMap["Home & Garden"],
    },
    {
      name: "Kitchen",
      description: "Kitchenware and tools",
      category_id: categoryIdMap["Home & Garden"],
    },
    {
      name: "Outdoor",
      description: "Garden and outdoor supplies",
      category_id: categoryIdMap["Home & Garden"],
    },
    {
      name: "Lighting",
      description: "Indoor and outdoor lighting solutions",
      category_id: categoryIdMap["Home & Garden"],
    },
    {
      name: "Bedding",
      description: "Bedding and linens for your home",
      category_id: categoryIdMap["Home & Garden"],
    },
    {
      name: "Storage Solutions",
      description: "Organizers and storage bins",
      category_id: categoryIdMap["Home & Garden"],
    },

    // Books
    {
      name: "Fiction",
      description: "Novels and stories",
      category_id: categoryIdMap["Books"],
    },
    {
      name: "Non-Fiction",
      description: "Educational and informative",
      category_id: categoryIdMap["Books"],
    },
    {
      name: "Comics",
      description: "Graphic novels and manga",
      category_id: categoryIdMap["Books"],
    },
    {
      name: "Children's Books",
      description: "Books for kids of all ages",
      category_id: categoryIdMap["Books"],
    },
    {
      name: "Textbooks",
      description: "Academic books for students",
      category_id: categoryIdMap["Books"],
    },
    {
      name: "Self-Help",
      description: "Books for personal development",
      category_id: categoryIdMap["Books"],
    },

    // Sports & Outdoors
    {
      name: "Camping",
      description: "Camping gear and supplies",
      category_id: categoryIdMap["Sports & Outdoors"],
    },
    {
      name: "Gym Equipment",
      description: "Exercise and gym tools",
      category_id: categoryIdMap["Sports & Outdoors"],
    },
    {
      name: "Cycling",
      description: "Bikes and cycling accessories",
      category_id: categoryIdMap["Sports & Outdoors"],
    },
    {
      name: "Fishing",
      description: "Fishing gear and accessories",
      category_id: categoryIdMap["Sports & Outdoors"],
    },
    {
      name: "Running",
      description: "Running shoes and apparel",
      category_id: categoryIdMap["Sports & Outdoors"],
    },
    {
      name: "Hiking",
      description: "Hiking gear and supplies",
      category_id: categoryIdMap["Sports & Outdoors"],
    },

    // Beauty & Personal Care
    {
      name: "Skincare",
      description: "Lotions, creams, and moisturizers",
      category_id: categoryIdMap["Beauty & Personal Care"],
    },
    {
      name: "Makeup",
      description: "Cosmetics and accessories",
      category_id: categoryIdMap["Beauty & Personal Care"],
    },
    {
      name: "Hair Care",
      description: "Shampoos, conditioners, and treatments",
      category_id: categoryIdMap["Beauty & Personal Care"],
    },
    {
      name: "Fragrances",
      description: "Perfumes and colognes",
      category_id: categoryIdMap["Beauty & Personal Care"],
    },
    {
      name: "Nail Care",
      description: "Nail polish and manicure tools",
      category_id: categoryIdMap["Beauty & Personal Care"],
    },
    {
      name: "Oral Care",
      description: "Toothpaste, toothbrushes, and mouthwash",
      category_id: categoryIdMap["Beauty & Personal Care"],
    },

    // Toys & Games
    {
      name: "Board Games",
      description: "Classic and modern board games",
      category_id: categoryIdMap["Toys & Games"],
    },
    {
      name: "Action Figures",
      description: "Collectible action figures",
      category_id: categoryIdMap["Toys & Games"],
    },
    {
      name: "Puzzles",
      description: "Puzzles for all ages",
      category_id: categoryIdMap["Toys & Games"],
    },
    {
      name: "Building Sets",
      description: "Construction toys like LEGO",
      category_id: categoryIdMap["Toys & Games"],
    },
    {
      name: "Educational Toys",
      description: "Toys that promote learning",
      category_id: categoryIdMap["Toys & Games"],
    },
    {
      name: "Dolls",
      description: "Dolls and stuffed animals",
      category_id: categoryIdMap["Toys & Games"],
    },

    // Automotive
    {
      name: "Car Accessories",
      description: "Accessories for car interiors",
      category_id: categoryIdMap["Automotive"],
    },
    {
      name: "Maintenance & Care",
      description: "Cleaning and maintenance tools",
      category_id: categoryIdMap["Automotive"],
    },
    {
      name: "Motorcycle Parts",
      description: "Parts and accessories for motorcycles",
      category_id: categoryIdMap["Automotive"],
    },
    {
      name: "Tires",
      description: "Various types of tires for vehicles",
      category_id: categoryIdMap["Automotive"],
    },
    {
      name: "GPS & Navigation",
      description: "GPS devices and mounts",
      category_id: categoryIdMap["Automotive"],
    },
    {
      name: "Audio Systems",
      description: "Sound systems for vehicles",
      category_id: categoryIdMap["Automotive"],
    },
    {
      name: "Motorcycle Accessories",
      description: "Accessories for motorcycles",
      category_id: categoryIdMap["Automotive"],
    },
    {
      name: "RV Accessories",
      description: "Accessories for RVs",
      category_id: categoryIdMap["Automotive"],
    },
  ];

  await db.insertInto("subcategory").values(subcategories).execute();
}
