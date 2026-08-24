window.Store = {
  getProducts: function () {
    try {
      const data = localStorage.getItem("irp_products");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  getSales: function () {
    try {
      const data = localStorage.getItem("irp_sales");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveProducts: function (array) {
    localStorage.setItem("irp_products", JSON.stringify(array));
  },

  saveSales: function (array) {
    localStorage.setItem("irp_sales", JSON.stringify(array));
  },

  addProduct: function (productWithoutId) {
    const products = this.getProducts();
    const id = this.generateId();
    const product = {
      ...productWithoutId,
      id: id,
      currentStock: Number(productWithoutId.currentStock),
      leadTimeDays: Number(productWithoutId.leadTimeDays),
      unitCost: Number(productWithoutId.unitCost),
    };
    products.push(product);
    this.saveProducts(products);
    return product;
  },

  addSale: function (saleWithoutId) {
    const sales = this.getSales();
    const products = this.getProducts();
    const id = this.generateId();
    const quantity = Number(saleWithoutId.quantity);

    const sale = {
      ...saleWithoutId,
      id: id,
      quantity: quantity,
    };

    const productIndex = products.findIndex((p) => p.id === sale.productId);
    if (productIndex !== -1) {
      products[productIndex].currentStock = Math.max(
        0,
        products[productIndex].currentStock - quantity,
      );
      this.saveProducts(products);
    }

    sales.push(sale);
    this.saveSales(sales);
    return sale;
  },

  getSalesForProduct: function (productId) {
    return this.getSales().filter((s) => s.productId === productId);
  },

  removeProduct: function (productId) {
    const products = this.getProducts().filter(
      (product) => product.id !== productId,
    );
    const sales = this.getSales().filter(
      (sale) => sale.productId !== productId,
    );
    this.saveProducts(products);
    this.saveSales(sales);
  },

  clearAll: function () {
    localStorage.removeItem("irp_products");
    localStorage.removeItem("irp_sales");
  },

  generateId: function () {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  },
};
