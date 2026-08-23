(function () {
    let currentFilter = "ALL";
    let lastRenderedRows = [];

    if (!document.getElementById("modal")) {
        const modal = document.createElement("div");
        modal.id = "modal";
        modal.className = "modal";
        modal.innerHTML = '<div class="modal-content"><div class="modal-header"><h2 id="modal-title">Products</h2><button id="modal-close" type="button" aria-label="Close">&times;</button></div><div id="modal-list" class="modal-list-container"></div></div>';
        document.body.appendChild(modal);
    }

    function render() {
        const windowDaysSelect = document.getElementById("window-days");
        const windowDays = Number(windowDaysSelect.value);
        const todayISO = new Date().toISOString().split('T')[0];

        const products = window.Store.getProducts();
        const tbody = document.getElementById("forecast-body");
        const emptyState = document.getElementById("empty-state");
        const table = document.getElementById("forecast-table");

        let totalCount = 0;
        let reorderCount = 0;
        let lowCount = 0;
        let okCount = 0;

        const rowsData = [];

        for (let i = 0; i < products.length; i++) {
            const p = products[i];
            const sales = window.Store.getSalesForProduct(p.id);
            const forecast = window.Forecast.calculateForecast({
                sales: sales,
                currentStock: p.currentStock,
                leadTimeDays: p.leadTimeDays,
                windowDays: windowDays,
                todayISO: todayISO
            });

            rowsData.push({
                product: p,
                forecast: forecast
            });

            totalCount++;
            if (forecast.status === "REORDER_NOW") reorderCount++;
            else if (forecast.status === "LOW") lowCount++;
            else if (forecast.status === "OK") okCount++;
        }

        document.getElementById("stat-total").querySelector('.count').textContent = totalCount;
        document.getElementById("stat-reorder").querySelector('.count').textContent = reorderCount;
        document.getElementById("stat-low").querySelector('.count').textContent = lowCount;
        document.getElementById("stat-ok").querySelector('.count').textContent = okCount;

        if (products.length === 0) {
            emptyState.classList.remove("hidden");
            table.classList.add("hidden");
        } else {
            emptyState.classList.add("hidden");
            table.classList.remove("hidden");
        }

        const categoryOrder = { "Groceries": 1, "Clothing": 2, "Accessories": 3, "Stationery": 4, "Decorations": 5 };

        rowsData.sort((a, b) => {
            const statusOrder = { "REORDER_NOW": 1, "LOW": 2, "OK": 3 };
            if (statusOrder[a.forecast.status] !== statusOrder[b.forecast.status]) {
                return statusOrder[a.forecast.status] - statusOrder[b.forecast.status];
            }
            
            const catA = categoryOrder[a.product.category] || 99;
            const catB = categoryOrder[b.product.category] || 99;
            if (catA !== catB) {
                return catA - catB;
            }

            const daysA = a.forecast.daysOfStockLeft === null ? Infinity : a.forecast.daysOfStockLeft;
            const daysB = b.forecast.daysOfStockLeft === null ? Infinity : b.forecast.daysOfStockLeft;
            return daysA - daysB;
        });

        lastRenderedRows = rowsData;
        

        tbody.innerHTML = "";

        for (let i = 0; i < rowsData.length; i++) {
            const data = rowsData[i];
            const tr = document.createElement("tr");

            let statusClass = "";
            let statusText = "";
            if (data.forecast.status === "REORDER_NOW") {
                statusClass = "status-reorder";
                statusText = "Reorder now";
            } else if (data.forecast.status === "LOW") {
                statusClass = "status-low";
                statusText = "Running low";
            } else {
                statusClass = "status-ok";
                statusText = "Healthy";
            }

            tr.classList.add(statusClass);

            const nameEscaped = document.createElement('div');
            nameEscaped.textContent = data.product.name;
            
            const catEscaped = document.createElement('div');
            catEscaped.textContent = data.product.category;

            const skuEscaped = document.createElement('div');
            skuEscaped.textContent = data.product.sku || "";

            const daysLeft = data.forecast.daysOfStockLeft === null ? "&mdash;" : data.forecast.daysOfStockLeft;

            tr.innerHTML = `
                <td>
                    <div style="font-weight: 500; margin-bottom: 0.25rem;">${nameEscaped.innerHTML}</div>
                    <span class="category-badge">${catEscaped.innerHTML}</span>
                </td>
                <td>${skuEscaped.innerHTML}</td>
                <td>${data.product.currentStock}</td>
                <td style="opacity: 0.5;">${data.product.leadTimeDays}d</td>
                <td>${data.forecast.avgDailyDemand}</td>
                <td style="opacity: 0.5;">${data.forecast.demandStdDev}</td>
                <td>${data.forecast.safetyStock}</td>
                <td><strong style="font-size: 1.05em;">${data.forecast.reorderPoint}</strong></td>
                <td>${daysLeft}</td>
                <td><strong style="font-size: 1.05em; color: var(--primary);">${data.forecast.suggestedOrderQty}</strong></td>
                <td><span class="${statusClass}">${statusText}</span></td>
            `;
            tbody.appendChild(tr);
        }

        repopulateDropdown();
    }

    function repopulateDropdown() {
        const catSelect = document.getElementById("sale-category");
        const currentCat = catSelect.value;
        const products = window.Store.getProducts();
        
        const categoryOrderMap = { "Groceries": 1, "Clothing": 2, "Accessories": 3, "Stationery": 4, "Decorations": 5 };
        const categories = [...new Set(products.map(p => p.category).filter(Boolean))].sort((a, b) => {
            return (categoryOrderMap[a] || 99) - (categoryOrderMap[b] || 99);
        });
        
        catSelect.innerHTML = '<option value="">Select a category...</option>';
        for (let i = 0; i < categories.length; i++) {
            const opt = document.createElement("option");
            opt.value = categories[i];
            opt.textContent = categories[i];
            catSelect.appendChild(opt);
        }
        
        if (categories.includes(currentCat)) {
            catSelect.value = currentCat;
        }

        updateProductDropdown();
    }

    function updateProductDropdown() {
        const catSelect = document.getElementById("sale-category");
        const prodSelect = document.getElementById("sale-product");
        const currentProd = prodSelect.value;
        const selectedCat = catSelect.value;
        const products = window.Store.getProducts();

        prodSelect.innerHTML = '';
        
        if (!selectedCat) {
            prodSelect.innerHTML = '<option value="">Select a category first...</option>';
            prodSelect.disabled = true;
            return;
        }
        
        prodSelect.disabled = false;
        prodSelect.innerHTML = '<option value="">Select a product...</option>';
        
        const filteredProducts = products.filter(p => p.category === selectedCat);
        for (let i = 0; i < filteredProducts.length; i++) {
            const opt = document.createElement("option");
            opt.value = filteredProducts[i].id;
            opt.textContent = filteredProducts[i].name;
            prodSelect.appendChild(opt);
        }
        
        if (filteredProducts.some(p => p.id === currentProd)) {
            prodSelect.value = currentProd;
        }
    }

    function showToast(message) {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.classList.remove("hidden");
        setTimeout(() => {
            toast.classList.add("hidden");
        }, 2500);
    }

    document.getElementById("product-form").addEventListener("submit", function (e) {
        e.preventDefault();
        const nameInput = document.getElementById("product-name");
        const skuInput = document.getElementById("product-sku");

        const categoryInput = document.getElementById("product-category");
        const stockInput = document.getElementById("product-stock");
        const leadtimeInput = document.getElementById("product-leadtime");
        const costInput = document.getElementById("product-cost");

        if (nameInput.value.trim() === "" || skuInput.value.trim() === "") return;
        const stock = Number(stockInput.value);
        const leadtime = Number(leadtimeInput.value);
        const cost = Number(costInput.value);

        if (stock < 0 || leadtime < 1 || cost < 0) return;

        window.Store.addProduct({
            name: nameInput.value.trim(),
            sku: skuInput.value.trim(),

            category: categoryInput.value.trim(),
            currentStock: stock,
            leadTimeDays: leadtime,
            unitCost: cost
        });

        this.reset();
        repopulateDropdown();
        render();
        showToast("Product added successfully");
    });

    document.getElementById("sale-form").addEventListener("submit", function (e) {
        e.preventDefault();
        const productSelect = document.getElementById("sale-product");
        const qtyInput = document.getElementById("sale-quantity");
        const dateInput = document.getElementById("sale-date");

        const productId = productSelect.value;
        const qty = Number(qtyInput.value);
        const dateStr = dateInput.value;

        if (!productId || qty < 1 || !Number.isInteger(qty)) return;

        const saleDate = new Date(dateStr);
        const today = new Date(new Date().toISOString().split('T')[0]);
        if (saleDate > today) return;

        window.Store.addSale({
            productId: productId,
            quantity: qty,
            saleDate: dateStr
        });

        this.reset();
        document.getElementById("sale-category").value = "";
        updateProductDropdown();
        dateInput.value = today.toISOString().split('T')[0];
        render();
        showToast("Sale logged successfully");
    });

    document.getElementById("sale-category").addEventListener("change", updateProductDropdown);

    document.getElementById("window-days").addEventListener("change", render);

    document.getElementById("btn-demo").addEventListener("click", function () {
        if (window.DemoData) {
            window.DemoData.load();
            repopulateDropdown();
            render();
            showToast("Demo data loaded");
        }
    });

    document.getElementById("btn-clear").addEventListener("click", function () {
        if (confirm("Are you sure you want to clear all data?")) {
            window.Store.clearAll();
            render();
            showToast("Data cleared");
        }
    });

    function showModal(title, items) {
        document.getElementById('modal-title').textContent = title;
        const listContainer = document.getElementById('modal-list');
        listContainer.innerHTML = '';
        
        if (items.length === 0) {
            listContainer.innerHTML = '<div style="text-align:center; opacity:0.6; padding: 1rem;">No items in this category</div>';
        } else {
            const grouped = {};
            items.forEach(item => {
                const cat = item.product.category || "Other";
                if (!grouped[cat]) grouped[cat] = [];
                grouped[cat].push(item);
            });

            const categoryOrderMap = { "Groceries": 1, "Clothing": 2, "Accessories": 3, "Stationery": 4, "Decorations": 5 };
            const orderedCategories = Object.keys(grouped).sort((a, b) => {
                return (categoryOrderMap[a] || 99) - (categoryOrderMap[b] || 99);
            });

            for (let i = 0; i < orderedCategories.length; i++) {
                const cat = orderedCategories[i];
                const catHeader = document.createElement('h3');
                catHeader.textContent = cat;
                catHeader.style.margin = '1rem 0 0.5rem 0';
                catHeader.style.fontSize = '1rem';
                catHeader.style.color = 'var(--primary)';
                catHeader.style.borderBottom = '2px solid var(--border)';
                catHeader.style.paddingBottom = '0.25rem';
                listContainer.appendChild(catHeader);
                
                const ul = document.createElement('ul');
                grouped[cat].forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item.product.name;
                    
                    const span = document.createElement('span');
                    span.textContent = `Stock: ${item.product.currentStock}`;
                    
                    li.appendChild(span);
                    ul.appendChild(li);
                });
                listContainer.appendChild(ul);
            }
        }
        document.getElementById('modal').classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    document.getElementById('modal-close').addEventListener('click', function() {
        document.getElementById('modal').classList.remove('show');
        document.body.style.overflow = '';
    });

    document.getElementById('modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    document.getElementById("stat-total").addEventListener("click", function() { 
        currentFilter = "ALL"; render(); 
        showModal("📦 All Products Tracked", lastRenderedRows);
    });
    document.getElementById("stat-reorder").addEventListener("click", function() { 
        currentFilter = "REORDER_NOW"; render(); 
        showModal("🚨 Needs Reordering", lastRenderedRows.filter(r => r.forecast.status === "REORDER_NOW"));
    });
    document.getElementById("stat-low").addEventListener("click", function() { 
        currentFilter = "LOW"; render(); 
        showModal("⚠️ Running Low", lastRenderedRows.filter(r => r.forecast.status === "LOW"));
    });
    document.getElementById("stat-ok").addEventListener("click", function() { 
        currentFilter = "OK"; render(); 
        showModal("✅ Healthy", lastRenderedRows.filter(r => r.forecast.status === "OK"));
    });

    document.addEventListener("DOMContentLoaded", function () {
        const todayISO = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById("sale-date");
        dateInput.value = todayISO;
        dateInput.max = todayISO;

        repopulateDropdown();
        render();
    });
})();
