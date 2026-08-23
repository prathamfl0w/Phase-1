(function () {
    const todayISO = () => new Date().toISOString().split("T")[0];
    const escape = (value) => { const el = document.createElement("span"); el.textContent = value; return el.innerHTML; };
    function toast(message) { const el = document.getElementById("toast"); el.textContent = message; el.classList.remove("hidden"); setTimeout(() => el.classList.add("hidden"), 2500); }
    function statusFor(product) { return Forecast.calculateForecast({ sales: Store.getSalesForProduct(product.id), currentStock: product.currentStock, leadTimeDays: product.leadTimeDays, todayISO: todayISO() }); }
    function render() {
        const query = document.getElementById("inventory-search").value.trim().toLowerCase();
        const products = Store.getProducts().filter(p => `${p.name} ${p.sku || ""}`.toLowerCase().includes(query));
        const list = document.getElementById("inventory-list");
        document.getElementById("inventory-count").textContent = `${products.length} product${products.length === 1 ? "" : "s"} shown`;
        document.getElementById("inventory-empty").classList.toggle("hidden", products.length > 0);
        list.innerHTML = products.map(p => { const f = statusFor(p); const label = f.status === "REORDER_NOW" ? "Reorder now" : f.status === "LOW" ? "Running low" : "Healthy"; const cls = f.status === "REORDER_NOW" ? "status-reorder" : f.status === "LOW" ? "status-low" : "status-ok"; return `<article class="product-item"><div><h3>${escape(p.name)}</h3><p>${escape(p.sku || "No SKU")} · ${escape(p.category)}</p></div><div class="product-metrics"><span>${p.currentStock} in stock</span><span>${p.leadTimeDays} day lead time</span><span>₹${Number(p.unitCost).toFixed(2)}</span><b class="${cls}">${label}</b></div></article>`; }).join("");
    }
    document.getElementById("product-form").addEventListener("submit", function (event) { event.preventDefault(); const get = id => document.getElementById(id).value.trim(); const stock = Number(get("product-stock")), lead = Number(get("product-leadtime")), cost = Number(get("product-cost")); if (!get("product-name") || !get("product-sku") || !get("product-category") || stock < 0 || lead < 1 || cost < 0) return; Store.addProduct({ name: get("product-name"), sku: get("product-sku"), category: get("product-category"), currentStock: stock, leadTimeDays: lead, unitCost: cost }); this.reset(); render(); toast("Product added successfully"); });
    document.getElementById("inventory-search").addEventListener("input", render);
    render();
}());
