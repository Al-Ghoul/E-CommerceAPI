import type { Kysely } from 'kysely'

export async function seed(db: Kysely<any>): Promise<void> {
  const subcategories = await db
    .selectFrom('subcategory')
    .select(['id', 'name'])
    .execute();

  const subcategoryIdMap: Record<string, number> = {};
  subcategories.forEach(subcategory => {
    subcategoryIdMap[subcategory.name] = subcategory.id;
    console.info(subcategory.name, subcategory.id);
  });

  const products = [
    // Electronics > Mobile Phones
    { name: "iPhone 14 Pro", description: "Latest Apple smartphone with advanced features.", price: 999.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Mobile Phones"] },
    { name: "Samsung Galaxy S23", description: "Flagship Samsung phone with AMOLED display.", price: 899.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Mobile Phones"] },
    { name: "Google Pixel 7", description: "Smartphone with excellent camera quality.", price: 699.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Mobile Phones"] },
    { name: "OnePlus 11", description: "High-performance smartphone with a great price.", price: 749.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Mobile Phones"] },
    { name: "Xiaomi 12", description: "Affordable flagship smartphone.", price: 649.99, stock_quantity: 35, subcategory_id: subcategoryIdMap["Mobile Phones"] },
    { name: "Oppo Find X5", description: "Premium smartphone with fast charging.", price: 799.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Mobile Phones"] },
    { name: "Sony Xperia 1 IV", description: "Camera-focused smartphone.", price: 1099.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["Mobile Phones"] },
    { name: "Nokia G20", description: "Budget smartphone with great battery life.", price: 249.99, stock_quantity: 60, subcategory_id: subcategoryIdMap["Mobile Phones"] },
    { name: "Motorola Moto G Power", description: "Affordable phone with long battery life.", price: 199.99, stock_quantity: 70, subcategory_id: subcategoryIdMap["Mobile Phones"] },
    { name: "Realme GT 2 Pro", description: "High-performance smartphone at a competitive price.", price: 749.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Mobile Phones"] },

    // Electronics > Computers
    { name: "MacBook Pro 16\"", description: "Apple's high-performance laptop.", price: 2499.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Computers"] },
    { name: "Dell XPS 13", description: "Compact and powerful Windows laptop.", price: 1299.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Computers"] },
    { name: "HP Spectre x360", description: "Versatile 2-in-1 laptop.", price: 1399.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["Computers"] },
    { name: "Lenovo ThinkPad X1 Carbon", description: "Business laptop with excellent keyboard.", price: 1599.99, stock_quantity: 10, subcategory_id: subcategoryIdMap["Computers"] },
    { name: "Asus ROG Zephyrus G14", description: "Gaming laptop with high performance.", price: 1799.99, stock_quantity: 12, subcategory_id: subcategoryIdMap["Computers"] },
    { name: "Acer Swift 3", description: "Affordable ultrabook with good performance.", price: 699.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Computers"] },
    { name: "Microsoft Surface Laptop 4", description: "Sleek and portable laptop.", price: 1299.99, stock_quantity: 18, subcategory_id: subcategoryIdMap["Computers"] },
    { name: "Razer Blade 15", description: "Gaming laptop with stunning graphics.", price: 2499.99, stock_quantity: 8, subcategory_id: subcategoryIdMap["Computers"] },
    { name: "LG Gram 17", description: "Lightweight laptop with a large display.", price: 1799.99, stock_quantity: 10, subcategory_id: subcategoryIdMap["Computers"] },
    { name: "HP Envy x360", description: "2-in-1 laptop with great features.", price: 999.99, stock_quantity: 22, subcategory_id: subcategoryIdMap["Computers"] },

    // Electronics > Cameras
    { name: "Canon EOS R5", description: "High-resolution mirrorless camera.", price: 3899.99, stock_quantity: 12, subcategory_id: subcategoryIdMap["Cameras"] },
    { name: "Nikon Z6", description: "Versatile mirrorless camera.", price: 1999.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["Cameras"] },
    { name: "Sony A7 III", description: "Popular full-frame mirrorless camera.", price: 1999.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Cameras"] },
    { name: "GoPro HERO10", description: "Action camera for adventure enthusiasts.", price: 499.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Cameras"] },
    { name: "Fujifilm X-T4", description: "Compact camera with great color reproduction.", price: 1699.99, stock_quantity: 18, subcategory_id: subcategoryIdMap["Cameras"] },
    { name: "Panasonic Lumix GH5", description: "Great for video shooting.", price: 1399.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Cameras"] },
    { name: "Olympus OM-D E-M10 Mark III", description: "Lightweight mirrorless camera.", price: 699.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Cameras"] },
    { name: "DJI Osmo Action", description: "Action camera with dual screens.", price: 349.99, stock_quantity: 55, subcategory_id: subcategoryIdMap["Cameras"] },
    { name: "Nikon D3500", description: "Entry-level DSLR camera.", price: 499.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Cameras"] },
    { name: "Canon PowerShot G7 X Mark III", description: "Compact camera for vlogging.", price: 649.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["Cameras"] },

    // Electronics > Headphones
    { name: "Bose QuietComfort 35 II", description: "Noise-canceling over-ear headphones.", price: 299.99, stock_quantity: 60, subcategory_id: subcategoryIdMap["Headphones"] },
    { name: "Sony WH-1000XM4", description: "Industry-leading noise-canceling headphones.", price: 349.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Headphones"] },
    { name: "Apple AirPods Pro", description: "Wireless earbuds with active noise cancellation.", price: 249.99, stock_quantity: 70, subcategory_id: subcategoryIdMap["Headphones"] },
    { name: "Sennheiser HD 450BT", description: "Wireless over-ear headphones with good sound quality.", price: 199.99, stock_quantity: 80, subcategory_id: subcategoryIdMap["Headphones"] },
    { name: "Jabra Elite 85h", description: "Smart noise-canceling headphones.", price: 249.99, stock_quantity: 45, subcategory_id: subcategoryIdMap["Headphones"] },
    { name: "Beats Studio3 Wireless", description: "Stylish wireless headphones with deep bass.", price: 349.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Headphones"] },
    { name: "Anker Soundcore Life Q20", description: "Affordable noise-canceling headphones.", price: 89.99, stock_quantity: 100, subcategory_id: subcategoryIdMap["Headphones"] },
    { name: "Bang & Olufsen Beoplay H9", description: "Premium headphones with great sound quality.", price: 499.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["Headphones"] },
    { name: "Focal Listen Wireless", description: "High-fidelity wireless headphones.", price: 249.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Headphones"] },
    { name: "Sony WF-1000XM3", description: "True wireless noise-canceling earbuds.", price: 229.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Headphones"] },

    // Electronics > Wearable Tech
    { name: "Apple Watch Series 8", description: "Smartwatch with fitness tracking features.", price: 399.99, stock_quantity: 55, subcategory_id: subcategoryIdMap["Wearable Tech"] },
    { name: "Samsung Galaxy Watch 5", description: "Stylish smartwatch with health monitoring.", price: 329.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Wearable Tech"] },
    { name: "Fitbit Charge 5", description: "Fitness tracker with health metrics.", price: 149.99, stock_quantity: 80, subcategory_id: subcategoryIdMap["Wearable Tech"] },
    { name: "Garmin Forerunner 245", description: "GPS smartwatch for runners.", price: 349.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Wearable Tech"] },
    { name: "Amazfit GTR 3", description: "Affordable smartwatch with long battery life.", price: 199.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Wearable Tech"] },
    { name: "Suunto 9 Baro", description: "Durable sports watch with GPS.", price: 599.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["Wearable Tech"] },
    { name: "Withings Steel HR", description: "Hybrid smartwatch with fitness tracking.", price: 229.99, stock_quantity: 35, subcategory_id: subcategoryIdMap["Wearable Tech"] },
    { name: "Xiaomi Mi Band 6", description: "Budget-friendly fitness tracker.", price: 49.99, stock_quantity: 120, subcategory_id: subcategoryIdMap["Wearable Tech"] },
    { name: "Samsung Galaxy Fit 2", description: "Affordable fitness tracker with essential features.", price: 59.99, stock_quantity: 95, subcategory_id: subcategoryIdMap["Wearable Tech"] },
    { name: "Polar Vantage M", description: "Multisport GPS watch.", price: 349.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Wearable Tech"] },

    // Clothing > Men's Fashion
    { name: "Levi's 511 Slim Fit Jeans", description: "Stylish slim fit jeans.", price: 59.99, stock_quantity: 45, subcategory_id: subcategoryIdMap["Men's Fashion"] },
    { name: "Nike Dri-FIT T-Shirt", description: "Comfortable athletic t-shirt.", price: 29.99, stock_quantity: 60, subcategory_id: subcategoryIdMap["Men's Fashion"] },
    { name: "Adidas Ultraboost Sneakers", description: "High-performance running shoes.", price: 179.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Men's Fashion"] },
    { name: "Polo Ralph Lauren Classic Fit Shirt", description: "Timeless classic fit shirt.", price: 89.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Men's Fashion"] },
    { name: "H&M Casual Chinos", description: "Versatile chinos for any occasion.", price: 39.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Men's Fashion"] },
    { name: "The North Face Waterproof Jacket", description: "Durable waterproof jacket.", price: 129.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Men's Fashion"] },
    { name: "Tommy Hilfiger Hoodie", description: "Cozy hoodie for casual wear.", price: 69.99, stock_quantity: 35, subcategory_id: subcategoryIdMap["Men's Fashion"] },
    { name: "Under Armour Compression Shorts", description: "High-performance shorts for workouts.", price: 29.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Men's Fashion"] },
    { name: "Zara Casual Blazer", description: "Stylish blazer for formal occasions.", price: 129.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["Men's Fashion"] },
    { name: "Carhartt Work Pants", description: "Durable pants for tough jobs.", price: 59.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Men's Fashion"] },

    // Clothing > Women's Fashion
    { name: "Zara Floral Dress", description: "Beautiful floral summer dress.", price: 49.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Women's Fashion"] },
    { name: "H&M Knit Sweater", description: "Cozy knit sweater for winter.", price: 39.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Women's Fashion"] },
    { name: "Nike Sports Bra", description: "Comfortable sports bra for workouts.", price: 24.99, stock_quantity: 45, subcategory_id: subcategoryIdMap["Women's Fashion"] },
    { name: "Adidas Originals Leggings", description: "Stylish leggings for any occasion.", price: 69.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Women's Fashion"] },
    { name: "Levi's High Rise Jeans", description: "Trendy high-rise jeans for women.", price: 69.99, stock_quantity: 35, subcategory_id: subcategoryIdMap["Women's Fashion"] },
    { name: "Reformation Midi Skirt", description: "Sustainable fashion midi skirt.", price: 89.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Women's Fashion"] },
    { name: "Tommy Hilfiger Women's Blazer", description: "Chic blazer for a professional look.", price: 139.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["Women's Fashion"] },
    { name: "Mango Denim Jacket", description: "Classic denim jacket for layering.", price: 79.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Women's Fashion"] },
    { name: "Victoria's Secret Pajama Set", description: "Luxurious pajama set for comfort.", price: 49.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Women's Fashion"] },
    { name: "Lululemon Align Leggings", description: "High-quality leggings for yoga.", price: 98.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Women's Fashion"] },

    // Clothing > Kids
    { name: "Carter's Baby Onesie", description: "Cute onesie for infants.", price: 19.99, stock_quantity: 80, subcategory_id: subcategoryIdMap["Kids"] },
    { name: "Nike Kids' T-Shirt", description: "Fun t-shirt for active kids.", price: 24.99, stock_quantity: 70, subcategory_id: subcategoryIdMap["Kids"] },
    { name: "Adidas Children's Sneakers", description: "Comfortable sneakers for kids.", price: 49.99, stock_quantity: 60, subcategory_id: subcategoryIdMap["Kids"] },
    { name: "Puma Hoodie for Kids", description: "Cozy hoodie for chilly days.", price: 39.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Kids"] },
    { name: "H&M Kids' Jeans", description: "Stylish jeans for children.", price: 29.99, stock_quantity: 75, subcategory_id: subcategoryIdMap["Kids"] },
    { name: "Gap Kids' Dress", description: "Cute dress for girls.", price: 34.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Kids"] },
    { name: "Old Navy Swim Trunks", description: "Fun swim trunks for summer.", price: 19.99, stock_quantity: 60, subcategory_id: subcategoryIdMap["Kids"] },
    { name: "Lego Pajama Set", description: "Fun pajamas for LEGO fans.", price: 29.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Kids"] },
    { name: "Disney Princess Backpack", description: "Cute backpack for kids.", price: 29.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Kids"] },
    { name: "Little Me Winter Coat", description: "Warm winter coat for toddlers.", price: 49.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Kids"] },

    // Clothing > Shoes
    { name: "Nike Air Max  270", description: "Comfortable and stylish sneakers.", price: 149.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Shoes"] },
    { name: "Adidas Stan Smith", description: "Classic tennis shoes.", price: 99.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Shoes"] },
    { name: "Dr. Martens 1460 Boots", description: "Iconic leather boots.", price: 169.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Shoes"] },
    { name: "Vans Classic Slip-On", description: "Casual slip-on shoes.", price: 59.99, stock_quantity: 45, subcategory_id: subcategoryIdMap["Shoes"] },
    { name: "Puma RS-X", description: "Trendy sneakers with retro style.", price: 119.99, stock_quantity: 35, subcategory_id: subcategoryIdMap["Shoes"] },
    { name: "Converse Chuck Taylor All Star", description: "Classic canvas sneakers.", price: 54.99, stock_quantity: 60, subcategory_id: subcategoryIdMap["Shoes"] },
    { name: "New Balance 990", description: "High-quality running shoes.", price: 179.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Shoes"] },
    { name: "ASICS Gel-Kayano", description: "Supportive running shoes.", price: 159.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Shoes"] },
    { name: "Hoka One One Bondi 7", description: "Maximum cushion running shoes.", price: 159.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Shoes"] },
    { name: "Reebok Classic Leather", description: "Timeless athletic shoes.", price: 74.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Shoes"] },

    // Clothing > Accessories
    { name: "Ray-Ban Aviator Sunglasses", description: "Classic aviator sunglasses.", price: 199.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Accessories"] },
    { name: "Fossil Leather Wallet", description: "Stylish leather wallet.", price: 79.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Accessories"] },
    { name: "Belt with Automatic Buckle", description: "Adjustable belt for men.", price: 29.99, stock_quantity: 60, subcategory_id: subcategoryIdMap["Accessories"] },
    { name: "Casio Digital Watch", description: "Classic digital watch.", price: 49.99, stock_quantity: 70, subcategory_id: subcategoryIdMap["Accessories"] },
    { name: "Nike Baseball Cap", description: "Comfortable cap for sunny days.", price: 25.99, stock_quantity: 80, subcategory_id: subcategoryIdMap["Accessories"] },
    { name: "Gucci Silk Scarf", description: "Luxury silk scarf.", price: 299.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["Accessories"] },
    { name: "Under Armour Sports Headband", description: "Moisture-wicking headband.", price: 14.99, stock_quantity: 100, subcategory_id: subcategoryIdMap["Accessories"] },
    { name: "H&M Beanie Hat", description: "Cozy knit beanie.", price: 19.99, stock_quantity: 90, subcategory_id: subcategoryIdMap["Accessories"] },
    { name: "Coach Crossbody Bag", description: "Stylish crossbody bag for everyday use.", price: 249.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Accessories"] },
    { name: "Adidas Performance Socks", description: "Comfortable sports socks.", price: 12.99, stock_quantity: 150, subcategory_id: subcategoryIdMap["Accessories"] },

    // Home & Garden > Furniture
    { name: "IKEA Kallax Shelf", description: "Versatile shelf for storage.", price: 89.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Furniture"] },
    { name: "Wayfair Sectional Sofa", description: "Spacious sectional sofa.", price: 899.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["Furniture"] },
    { name: "Ashley Furniture Dining Table", description: "Elegant dining table for family meals.", price: 499.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Furniture"] },
    { name: "West Elm Mid-Century Chair", description: "Stylish chair for living rooms.", price: 399.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Furniture"] },
    { name: "Target TV Stand", description: "Modern TV stand for living room.", price: 199.99, stock_quantity: 35, subcategory_id: subcategoryIdMap["Furniture"] },
    { name: "IKEA Hemnes Dresser", description: "Classic dresser for bedrooms.", price: 299.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Furniture"] },
    { name: "La-Z-Boy Recliner", description: "Comfortable recliner chair.", price: 649.99, stock_quantity: 10, subcategory_id: subcategoryIdMap["Furniture"] },
    { name: "Pottery Barn Coffee Table", description: "Stylish coffee table.", price: 399.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["Furniture"] },
    { name: "Wayfair Bed Frame", description: "Elegant bed frame for bedrooms.", price: 499.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Furniture"] },
    { name: "Kirkland Signature Mattress", description: "High-quality mattress for comfort.", price: 699.99, stock_quantity: 10, subcategory_id: subcategoryIdMap["Furniture"] },

    // Home & Garden > Kitchen
    { name: "Instant Pot Duo 7-in-1", description: "Multi-function pressure cooker.", price: 89.99, stock_quantity: 60, subcategory_id: subcategoryIdMap["Kitchen"] },
    { name: "KitchenAid Stand Mixer", description: "High-performance stand mixer.", price: 379.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Kitchen"] },
    { name: "Ninja Foodi Air Fryer", description: "Versatile air fryer for healthier cooking.", price: 199.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Kitchen"] },
    { name: "Cuisinart Food Processor", description: "Powerful food processor for quick meals.", price: 99.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Kitchen"] },
    { name: "Le Creuset Dutch Oven", description: "Enamel-coated cast iron cookware.", price: 349.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["Kitchen"] },
    { name: "Pyrex Glass Bakeware Set", description: "Durable glass bakeware for oven use.", price: 39.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Kitchen"] },
    { name: "Bialetti Moka Express", description: "Classic stovetop espresso maker.", price: 29.99, stock_quantity: 75, subcategory_id: subcategoryIdMap["Kitchen"] },
    { name: "Vitamix Blender", description: "High-performance blender for smoothies.", price: 499.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Kitchen"] },
    { name: "OXO Good Grips Kitchen Utensil Set", description: "Essential kitchen utensils.", price: 49.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Kitchen"] },
    { name: "Anova Precision Cooker", description: "Sous vide precision cooker.", price: 129.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Kitchen"] },

    // Home & Garden > Decor
    { name: "Framed Canvas Wall Art", description: "Beautiful wall art for home decor.", price: 59.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Decor"] },
    { name: "Mason Jar Candle Holders", description: "Rustic candle holders for ambiance.", price: 29.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Decor"] },
    { name: "IKEA Ficus Artificial Plant", description: "Realistic artificial plant for decor.", price: 49.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Decor"] },
    { name: "Wayfair Decorative Throw Pillows", description: "Stylish pillows for sofas.", price: 39.99, stock_quantity: 35, subcategory_id: subcategoryIdMap["Decor"] },
    { name: "West Elm Modern Area Rug", description: "Elegant area rug for living spaces.", price: 199.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Decor"] },
    { name: "Target Wall Mirror", description: "Decorative wall mirror.", price: 79.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Decor"] },
    { name: "Pottery Barn Throw Blanket", description: "Cozy throw blanket for warmth.", price: 49.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Decor"] },
    { name: "Anthropologie Vintage-Inspired Vases", description: "Unique vases for flower arrangements.", price: 59.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["Decor"] },
    { name: "CB2 Mid-Century Coffee Table", description: "Stylish coffee table for decor.", price: 299.99, stock_quantity: 10, subcategory_id: subcategoryIdMap["Decor"] },
    { name: "Bed Bath & Beyond Wall Clock", description: "Elegant wall clock for home.", price: 39.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Decor"] },

    // Home & Garden > Bedding
    { name: "Cozy Earth Bamboo Sheet Set", description: "Soft and breathable sheets.", price: 149.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Bedding"] },
    { name: "Tuft & Needle Mattress Protector", description: "Protect your mattress from spills.", price: 59.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Bedding"] },
    { name: "Brooklinen Duvet Cover", description: "Luxury duvet cover for comfort.", price: 99.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Bedding"] },
    { name: "Target Weighted Blanket", description: "Cozy weighted blanket for relaxation.", price: 89.99, stock_quantity: 35, subcategory_id: subcategoryIdMap["Bedding"] },
    { name: "Martha Stewart Collection Pillows", description: "Soft pillows for support.", price: 39.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Bedding"] },
    { name: "Amazon Basics Microfiber Bed Sheet Set", description: "Affordable and comfortable sheets.", price: 29.99, stock_quantity: 60, subcategory_id: subcategoryIdMap["Bedding"] },
    { name: "L.L.Bean Flannel Sheets", description: "Warm flannel sheets for winter.", price: 89.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Bedding"] },
    { name: "Parachute Down Alternative Comforter", description: "Fluffy comforter for warmth.", price: 129.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["Bedding"] },
    { name: "Serta Memory Foam Mattress", description: "Comfortable memory foam mattress.", price: 699.99, stock_quantity: 10, subcategory_id: subcategoryIdMap["Bedding"] },
    { name: "Zinus Green Tea Memory Foam Mattress", description: "Affordable mattress with comfort.", price: 249.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Bedding"] },

    // Beauty & Personal Care > Skincare
    { name: "CeraVe Hydrating Facial Cleanser", description: "Gentle cleanser for all skin types.", price: 14.99, stock_quantity: 100, subcategory_id: subcategoryIdMap["Skincare"] },
    { name: "Neutrogena Hydro Boost Water Gel", description: "Hydrating gel moisturizer.", price: 29.99, stock_quantity: 75, subcategory_id: subcategoryIdMap["Skincare"] },
    { name: "The Ordinary Niacinamide 10% + Zinc 1%", description: "Brightening serum for skin.", price: 5.99, stock_quantity: 200, subcategory_id: subcategoryIdMap["Skincare"] },
    { name: "La Roche-Posay Anthelios Sunscreen", description: "Broad-spectrum SPF 50 sunscreen.", price: 36.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Skincare"] },
    { name: "Clinique Moisture Surge", description: "Hydrating gel-cream moisturizer.", price: 39.99, stock_quantity: 35, subcategory_id: subcategoryIdMap["Skincare"] },
    { name: "Kiehl's Midnight Recovery Concentrate", description: "Nightly facial oil for rejuvenation.", price: 54.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Skincare"] },
    { name: "Tatcha The Water Cream", description: "Oil-free moisturizer for smooth skin.", price: 68.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Skincare"] },
    { name: "Mario Badescu Facial Spray", description: "Refreshing facial mist.", price: 7.99, stock_quantity: 80, subcategory_id: subcategoryIdMap["Skincare"] },
    { name: "Burt's Bees Lip Balm", description: "Natural lip balm for hydration.", price: 4.99, stock_quantity: 150, subcategory_id: subcategoryIdMap["Skincare"] },
    { name: "Origins GinZing Eye Cream", description: "Brightening eye cream for dark circles.", price: 29.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Skincare"] },

    // Beauty & Personal Care > Hair Care
    { name: "Olaplex No. 3 Hair Perfector", description: "At-home treatment for healthy hair.", price: 29.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Hair Care"] },
    { name: "Redken Extreme Length Shampoo", description: "Shampoo for long hair.", price: 21.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Hair Care"] },
    { name: "Moroccanoil Treatment", description: "Hair oil for nourishment and shine.", price: 44.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Hair Care"] },
    { name: "Kérastase Discipline Fluidissime", description: "Anti-frizz leave-in treatment.", price: 49.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Hair Care"] },
    { name: "Aussie 3 Minute Miracle Deep Conditioner", description: "Deep conditioning treatment for moisture.", price: 6.99, stock_quantity: 100, subcategory_id: subcategoryIdMap["Hair Care"] },
    { name: "Bumble and Bumble Hairdresser's Invisible Oil", description: "Nourishing oil for all hair types.", price: 37.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Hair Care"] },
    { name: "Garnier Fructis Sleek & Shine Conditioner", description: "Conditioner for smooth hair.", price: 4.99, stock_quantity: 150, subcategory_id: subcategoryIdMap["Hair Care"] },
    { name: "Pantene Pro-V Repair & Protect Shampoo", description: "Shampoo for damaged hair.", price: 7.99, stock_quantity: 80, subcategory_id: subcategoryIdMap["Hair Care"] },
    { name: "Living Proof Perfect Hair Day Dry Shampoo", description: "Dry shampoo for fresh hair.", price: 29.99, stock_quantity: 35, subcategory_id: subcategoryIdMap["Hair Care"] },
    { name: "SheaMoisture Curl Enhancing Smoothie", description: "Curl cream for defined curls.", price: 12.99, stock_quantity: 100, subcategory_id: subcategoryIdMap["Hair Care"] },

    // Beauty & Personal Care > Makeup
    { name: "Maybelline Fit Me Matte + Poreless Foundation", description: "Natural matte finish foundation.", price: 7.99, stock_quantity: 200, subcategory_id: subcategoryIdMap["Makeup"] },
    { name: "L'Oreal Paris Voluminous Mascara", description: "Volumizing mascara for bold lashes.", price: 8.99, stock_quantity: 180, subcategory_id: subcategoryIdMap["Makeup"] },
    { name: "Urban Decay Naked Palette", description: "Versatile eyeshadow palette.", price: 54.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Makeup"] },
    { name: "NARS Blush", description: "Highly pigmented blush for a natural glow.", price: 30.99, stock_quantity: 35, subcategory_id: subcategoryIdMap["Makeup"] },
    { name: "Fenty Beauty Gloss Bomb Lip Luminizer", description: "Universal lip gloss for shine.", price: 19.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Makeup"] },
    { name: "Too Faced Better Than Sex Mascara", description: "Lengthening mascara for dramatic lashes.", price: 25.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Makeup"] },
    { name: "Benefit Hoola Bronzer", description: "Matte bronzer for a sun-kissed look.", price: 34.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Makeup"] },
    { name: "Charlotte Tilbury Pillow Talk Lipstick", description: "Iconic lipstick shade.", price: 34.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Makeup"] },
    { name: "Tarte Shape Tape Concealer", description: "Full-coverage concealer for flawless skin.", price: 27.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Makeup"] },
    { name: "Anastasia Beverly Hills Dipbrow Pomade", description: "Waterproof brow pomade.", price: 22.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Makeup"] },

    // Toys & Games > Action Figures
    { name: "Marvel Legends Spider-Man Figure", description: "Articulated Spider-Man action figure.", price: 24.99, stock_quantity: 60, subcategory_id: subcategoryIdMap["Action Figures"] },
    { name: "Star Wars Black Series Kylo Ren Figure", description: "Highly detailed Kylo Ren action figure.", price: 29.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Action Figures"] },
    { name: "Transformers Generations Optimus Prime", description: "Transformable Optimus Prime figure.", price: 34.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Action Figures"] },
    { name: "G.I. Joe Classified Series Snake Eyes", description: "Classic G.I. Joe figure.", price: 29.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Action Figures"] },
    { name: "DC Multiverse Batman Figure", description: "Collectible Batman action figure.", price: 22.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Action Figures"] },
    { name: "Power Rangers Lightning Collection Red Ranger", description: "Action figure from Power Rangers.", price: 34.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Action Figures"] },
    { name: "Ninja Turtles Leonardo Figure", description: "Action figure of Leonardo from TMNT.", price: 19.99, stock_quantity: 45, subcategory_id: subcategoryIdMap["Action Figures"] },
    { name: "Fortnite Victory Royale Series Raptor", description: "Action figure from Fortnite game.", price: 29.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Action Figures"] },
    { name: "My Little Pony Twilight Sparkle Figure", description: "Cute figure of Twilight Sparkle.", price: 14.99, stock_quantity: 75, subcategory_id: subcategoryIdMap["Action Figures"] },
    { name: "Lego Star Wars X-Wing Starfighter", description: "Buildable X-Wing Starfighter set.", price: 49.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Action Figures"] },

    // Toys & Games > Board Games
    { name: "Settlers of Catan Board Game", description: "Popular strategy board game.", price: 39.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Board Games"] },
    { name: "Monopoly Classic Board Game", description: "Family favorite board game.", price: 19.99, stock_quantity: 60, subcategory_id: subcategoryIdMap["Board Games"] },
    { name: "Ticket to Ride Board Game", description: "Exciting train adventure board game.", price: 49.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Board Games"] },
    { name: "Codenames Party Game", description: "Fun word association party game.", price: 24.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Board Games"] },
    { name: "Carcassonne Tile-Laying Game", description: "Strategic tile-laying board game.", price: 34.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Board Games"] },
    { name: "Pandemic Cooperative Board Game", description: "Collaborative board game to save the world.", price: 44.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Board Games"] },
    { name: "Risk Classic Strategy Game", description: "Conquer the world strategy game.", price: 29.99, stock_quantity: 35, subcategory_id: subcategoryIdMap["Board Games"] },
    { name: "Clue Classic Mystery Game", description: "Solve the mystery in the mansion.", price: 24.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Board Games"] },
    { name: "Apples to Apples Party Game", description: "Hilarious party game for friends.", price: 19.99, stock_quantity: 60, subcategory_id: subcategoryIdMap["Board Games"] },
    { name: "Scrabble Classic Word Game", description: "The classic word game for fun.", price: 29.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Board Games"] },

    // Automotive > Car Accessories
    { name: "WeatherTech Floor Mats", description: "All-weather floor mats for your car.", price: 119.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Car Accessories"] },
    { name: "Husky Liners Cargo Liner", description: "Protective liner for the trunk.", price: 89.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Car Accessories"] },
    { name: "Thule Roof Rack", description: "Versatile roof rack for outdoor adventures.", price: 349.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["Car Accessories"] },
    { name: "DashCam Pro HD", description: "High-definition dashboard camera.", price: 149.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Car Accessories"] },
    { name: "Garmin GPS Navigator", description: "Portable GPS navigation system.", price: 199.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Car Accessories"] },
    { name: "Trunk Organizer", description: "Keep your trunk organized.", price: 34.99, stock_quantity: 60, subcategory_id: subcategoryIdMap["Car Accessories"] },
    { name: "Portable Car Vacuum", description: "Compact vacuum for car cleaning.", price: 39.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["Car Accessories"] },
    { name: "Car Seat Covers", description: "Stylish and protective seat covers.", price: 69.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Car Accessories"] },
    { name: "Jump Starter Power Bank", description: "Portable power bank for emergencies.", price: 89.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Car Accessories"] },
    { name: "LED Headlight Bulbs", description: "Bright LED headlights for improved visibility.", price: 49.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Car Accessories"] },

    // Automotive > Motorcycle Accessories
    { name: "Motorcycle Helmet", description: "Safety helmet for motorcycle riders.", price: 199.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["Motorcycle Accessories"] },
    { name: "Motorcycle Jacket", description: "Durable jacket for protection.", price: 249.99, stock_quantity: 10, subcategory_id: subcategoryIdMap["Motorcycle Accessories"] },
    { name: "Motorcycle Gloves", description: "Comfortable gloves for riders.", price: 49.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["Motorcycle Accessories"] },
    { name: "Motorcycle Cover", description: "Protective cover for your motorcycle.", price: 39.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Motorcycle Accessories"] },
    { name: "Motorcycle Lock", description: "Secure lock for motorcycle safety.", price: 29.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["Motorcycle Accessories"] },
    { name: "Motorcycle Tool Kit", description: "Essential tools for motorcycle maintenance.", price: 79.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["Motorcycle Accessories"] },
    { name: "Motorcycle Phone Mount", description: "Mount your phone while riding.", price: 19.99, stock_quantity: 40, subcategory_id: subcategoryIdMap["Motorcycle Accessories"] },
    { name: "Motorcycle Saddle Bags", description: "Storage bags for long rides.", price: 99.99, stock_quantity: 10, subcategory_id: subcategoryIdMap["Motorcycle Accessories"] },
    { name: "Motorcycle Rain Gear", description: "Stay dry while riding.", price: 59.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["Motorcycle Accessories"] },
    { name: "Motorcycle GPS", description: "GPS navigator for motorcycle routes.", price: 249.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["Motorcycle Accessories"] },

    // Automotive > RV Accessories
    { name: "RV Awning", description: "Retractable awning for RVs.", price: 299.99, stock_quantity: 10, subcategory_id: subcategoryIdMap["RV Accessories"] },
    { name: "RV Backup Camera", description: "Monitor your surroundings while backing up.", price: 199.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["RV Accessories"] },
    { name: "RV Water Filter", description: "Ensure clean water supply for your RV.", price: 49.99, stock_quantity: 30, subcategory_id: subcategoryIdMap["RV Accessories"] },
    { name: "RV Leveling Blocks", description: "Easy leveling for RVs.", price: 39.99, stock_quantity: 25, subcategory_id: subcategoryIdMap["RV Accessories"] },
    { name: "RV Solar Panel Kit", description: "Solar power for your RV.", price: 599.99, stock_quantity: 5, subcategory_id: subcategoryIdMap["RV Accessories"] },
    { name: "RV Portable Generator", description: "Power source for RVs.", price: 899.99, stock_quantity: 10, subcategory_id: subcategoryIdMap["RV Accessories"] },
    { name: "RV Outdoor Mat", description: "Keep your outdoor space clean.", price: 59.99, stock_quantity: 20, subcategory_id: subcategoryIdMap["RV Accessories"] },
    { name: "RV Tire Covers", description: "Protect your tires from the elements.", price: 29.99, stock_quantity: 50, subcategory_id: subcategoryIdMap["RV Accessories"] },
    { name: "RV Portable Propane Grill", description: "Grill for outdoor cooking.", price: 149.99, stock_quantity: 15, subcategory_id: subcategoryIdMap["RV Accessories"] },
    { name: "RV Satellite Dish", description: "Stay connected while on the road.", price: 399.99, stock_quantity: 5, subcategory_id: subcategoryIdMap["RV Accessories"] }
  ];

  await db
    .insertInto('product')
    .values(products)
    .execute();
}
