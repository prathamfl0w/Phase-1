// LocalStorage data layer for Inventory Reorder Point
window.Store = {
    // Gets all products from localStorage
    getProducts: function() {
        try {
            const data = localStorage.getItem("irp_products");
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    // Gets all sales from localStorage
    getSales: function() {
        try {
            const data = localStorage.getItem("irp_sales");
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    // Saves products array to localStorage
    saveProducts: function(array) {
        localStorage.setItem("irp_products", JSON.stringify(array));
    },

    // Saves sales array to localStorage
    saveSales: function(array) {
        localStorage.setItem("irp_sales", JSON.stringify(array));
    },

    // Adds a new product and returns it with a generated id
    addProduct: function(productWithoutId) {
        const products = this.getProducts();
        const id = this.generateId();
        const product = {
            ...productWithoutId,
            id: id,
            currentStock: Number(productWithoutId.currentStock),
            leadTimeDays: Number(productWithoutId.leadTimeDays),
            unitCost: Number(productWithoutId.unitCost)
        };
        products.push(product);
        this.saveProducts(products);
        return product;
    },

    // Adds a new sale, subtracts from product stock, and returns the sale
    addSale: function(saleWithoutId) {
        const sales = this.getSales();
        const products = this.getProducts();
        const id = this.generateId();
        const quantity = Number(saleWithoutId.quantity);
        
        const sale = {
            ...saleWithoutId,
            id: id,
            quantity: quantity
        };
        
        const productIndex = products.findIndex(p => p.id === sale.productId);
        if (productIndex !== -1) {
            products[productIndex].currentStock = Math.max(0, products[productIndex].currentStock - quantity);
            this.saveProducts(products);
        }
        
        sales.push(sale);
        this.saveSales(sales);
        return sale;
    },

    // Gets all sales for a specific product ID
    getSalesForProduct: function(productId) {
        return this.getSales().filter(s => s.productId === productId);
    },

    // Clears all project data from localStorage
    clearAll: function() {
        localStorage.removeItem("irp_products");
        localStorage.removeItem("irp_sales");
    },

    // Generates a unique string ID
    generateId: function() {
        return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    }
};
