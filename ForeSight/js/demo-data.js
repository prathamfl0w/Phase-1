window.DemoData = {
  load: function () {
    window.Store.clearAll();

    const products = [
      // Groceries
      {
        name: "🍎 Organic Gala Apples",
        category: "Groceries",
        currentStock: 120,
        leadTimeDays: 2,
        unitCost: 15,
      },
      {
        name: "🥦 Fresh Broccoli Crown",
        category: "Groceries",
        currentStock: 45,
        leadTimeDays: 2,
        unitCost: 35,
      },
      {
        name: "🍞 Whole Wheat Bread",
        category: "Groceries",
        currentStock: 30,
        leadTimeDays: 1,
        unitCost: 40,
      },
      {
        name: "🥚 Farm Fresh Eggs (Dozen)",
        category: "Groceries",
        currentStock: 80,
        leadTimeDays: 3,
        unitCost: 60,
      },
      {
        name: "🥛 2% Milk (1 Gallon)",
        category: "Groceries",
        currentStock: 50,
        leadTimeDays: 2,
        unitCost: 55,
      },
      {
        name: "🧀 Sharp Cheddar Block",
        category: "Groceries",
        currentStock: 40,
        leadTimeDays: 5,
        unitCost: 85,
      },
      {
        name: "🍗 Fresh Chicken Breast",
        category: "Groceries",
        currentStock: 25,
        leadTimeDays: 3,
        unitCost: 180,
      },

      // Stationery
      {
        name: "📓 A5 Ruled Notebook",
        category: "Stationery",
        currentStock: 200,
        leadTimeDays: 10,
        unitCost: 120,
      },
      {
        name: "🖊️ Black Gel Pens (12-Pack)",
        category: "Stationery",
        currentStock: 150,
        leadTimeDays: 7,
        unitCost: 250,
      },
      {
        name: "✏️ HB Pencils (Box of 20)",
        category: "Stationery",
        currentStock: 300,
        leadTimeDays: 7,
        unitCost: 100,
      },
      {
        name: "📎 Paper Clips (500 count)",
        category: "Stationery",
        currentStock: 85,
        leadTimeDays: 5,
        unitCost: 45,
      },
      {
        name: "✂️ Stainless Steel Scissors",
        category: "Stationery",
        currentStock: 40,
        leadTimeDays: 14,
        unitCost: 180,
      },
      {
        name: "🖍️ Colorful Highlighters",
        category: "Stationery",
        currentStock: 120,
        leadTimeDays: 10,
        unitCost: 90,
      },
      {
        name: "🗂️ Manila File Folders",
        category: "Stationery",
        currentStock: 400,
        leadTimeDays: 7,
        unitCost: 15,
      },

      // Clothing
      {
        name: "👕 Classic White T-Shirt",
        category: "Clothing",
        currentStock: 90,
        leadTimeDays: 14,
        unitCost: 350,
      },
      {
        name: "👖 Blue Denim Jeans",
        category: "Clothing",
        currentStock: 60,
        leadTimeDays: 21,
        unitCost: 1200,
      },
      {
        name: "🧥 Winter Puffer Jacket",
        category: "Clothing",
        currentStock: 15,
        leadTimeDays: 30,
        unitCost: 2500,
      },
      {
        name: "👗 Floral Summer Dress",
        category: "Clothing",
        currentStock: 25,
        leadTimeDays: 21,
        unitCost: 850,
      },
      {
        name: "🧦 Cotton Ankle Socks",
        category: "Clothing",
        currentStock: 300,
        leadTimeDays: 10,
        unitCost: 100,
      },
      {
        name: "🧢 Adjustable Baseball Cap",
        category: "Clothing",
        currentStock: 80,
        leadTimeDays: 14,
        unitCost: 250,
      },
      {
        name: "🧣 Knit Wool Scarf",
        category: "Clothing",
        currentStock: 45,
        leadTimeDays: 20,
        unitCost: 400,
      },

      // Accessories
      {
        name: "🕶️ Classic Aviator Sunglasses",
        category: "Accessories",
        currentStock: 35,
        leadTimeDays: 14,
        unitCost: 800,
      },
      {
        name: "⌚ Minimalist Leather Watch",
        category: "Accessories",
        currentStock: 20,
        leadTimeDays: 30,
        unitCost: 1500,
      },
      {
        name: "👜 Vegan Leather Tote Bag",
        category: "Accessories",
        currentStock: 18,
        leadTimeDays: 25,
        unitCost: 1200,
      },
      {
        name: "🎒 Canvas Travel Backpack",
        category: "Accessories",
        currentStock: 40,
        leadTimeDays: 20,
        unitCost: 950,
      },
      {
        name: "💼 Slim Bifold Wallet",
        category: "Accessories",
        currentStock: 55,
        leadTimeDays: 15,
        unitCost: 450,
      },
      {
        name: "💍 Silver Hoop Earrings",
        category: "Accessories",
        currentStock: 70,
        leadTimeDays: 14,
        unitCost: 300,
      },
      {
        name: "🎀 Satin Hair Scrunchies",
        category: "Accessories",
        currentStock: 150,
        leadTimeDays: 10,
        unitCost: 50,
      },

      // Decorations
      {
        name: "🕯️ Vanilla Scented Candle",
        category: "Decorations",
        currentStock: 85,
        leadTimeDays: 12,
        unitCost: 250,
      },
      {
        name: "🖼️ Minimalist Wall Art Frame",
        category: "Decorations",
        currentStock: 30,
        leadTimeDays: 20,
        unitCost: 650,
      },
      {
        name: "🪴 Artificial Potted Succulent",
        category: "Decorations",
        currentStock: 110,
        leadTimeDays: 15,
        unitCost: 180,
      },
      {
        name: "🛋️ Geometric Throw Pillow",
        category: "Decorations",
        currentStock: 45,
        leadTimeDays: 25,
        unitCost: 400,
      },
      {
        name: "💡 Warm White Fairy Lights",
        category: "Decorations",
        currentStock: 200,
        leadTimeDays: 10,
        unitCost: 150,
      },
      {
        name: "🏺 Ceramic Table Vase",
        category: "Decorations",
        currentStock: 25,
        leadTimeDays: 21,
        unitCost: 550,
      },
      {
        name: "🕰️ Vintage Desk Clock",
        category: "Decorations",
        currentStock: 15,
        leadTimeDays: 30,
        unitCost: 800,
      },
    ];

    const savedProducts = [];
    for (let i = 0; i < products.length; i++) {
      savedProducts.push(window.Store.addProduct(products[i]));
    }

    const salesToSave = [];
    const today = new Date();

    for (let i = 59; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      const dateStr = `${y}-${m}-${d}`;

      for (let p = 0; p < savedProducts.length; p++) {
        const prod = savedProducts[p];

        let qty = 0;
        const rand = Math.random();

        if (prod.category === "Groceries") {
          qty = rand > 0.3 ? Math.floor(Math.random() * 8) + 2 : 0; 
        } else if (prod.category === "Stationery") {
          qty = rand > 0.5 ? Math.floor(Math.random() * 5) + 1 : 0; 
        } else if (prod.category === "Clothing") {
          qty = rand > 0.6 ? Math.floor(Math.random() * 3) + 1 : 0; 
        } else if (prod.category === "Accessories") {
          qty = rand > 0.7 ? Math.floor(Math.random() * 2) + 1 : 0;
        } else if (prod.category === "Decorations") {
          qty = rand > 0.8 ? Math.floor(Math.random() * 2) + 1 : 0;
          if (i % 14 === 0) qty += 5;
        }

        if (qty > 0) {
          salesToSave.push({
            id: window.Store.generateId(),
            productId: prod.id,
            quantity: qty,
            saleDate: dateStr,
          });
        }
      }
    }

    window.Store.saveSales(salesToSave);
    return true;
  },
};
