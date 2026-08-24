(function () {
  const categoryEmojis = {
    Groceries: "🛒",
    Clothing: "👕",
    Accessories: "👜",
    Stationery: "✏️",
    Decorations: "🪴",
  };

  function nameWithCategoryEmoji(name, category) {
    const emoji = categoryEmojis[category] || "📦";
    return /^[^\w\s]/u.test(name) ? name : `${emoji} ${name}`;
  }

  const analyticsLink = document.querySelector(".nav-cta");
  if (analyticsLink) {
    analyticsLink.href = "analytics.html";
    analyticsLink.textContent = "Open analytics";
  }

  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/svg+xml";
  favicon.href = "favicon.svg";
  document.head.appendChild(favicon);

  const savedProducts = Store.getProducts();
  let productNameUpdated = false;
  savedProducts.forEach((product) => {
    if (product.name === "🥩 Grass-fed Ground Beef") {
      product.name = "🍗 Fresh Chicken Breast";
      product.unitCost = 180;
      productNameUpdated = true;
    }
  });
  if (productNameUpdated) Store.saveProducts(savedProducts);

  const todayISO = () => new Date().toISOString().split("T")[0];
  const escape = (value) => {
    const el = document.createElement("span");
    el.textContent = value;
    return el.innerHTML;
  };
  function toast(message) {
    const el = document.getElementById("toast");
    el.textContent = message;
    el.classList.remove("hidden");
    setTimeout(() => el.classList.add("hidden"), 2500);
  }
  function statusFor(product) {
    return Forecast.calculateForecast({
      sales: Store.getSalesForProduct(product.id),
      currentStock: product.currentStock,
      leadTimeDays: product.leadTimeDays,
      todayISO: todayISO(),
    });
  }
  function render() {
    const query = document
      .getElementById("inventory-search")
      .value.trim()
      .toLowerCase();
    const products = Store.getProducts().filter((p) =>
      p.name.toLowerCase().includes(query),
    );
    const list = document.getElementById("inventory-list");
    document.getElementById("inventory-count").textContent =
      `${products.length} product${products.length === 1 ? "" : "s"} shown`;
    document
      .getElementById("inventory-empty")
      .classList.toggle("hidden", products.length > 0);
    list.innerHTML = products
      .map((p) => {
        const f = statusFor(p);
        const label =
          f.status === "REORDER_NOW"
            ? "Reorder now"
            : f.status === "LOW"
              ? "Running low"
              : "Healthy";
        const cls =
          f.status === "REORDER_NOW"
            ? "status-reorder"
            : f.status === "LOW"
              ? "status-low"
              : "status-ok";
        const rowClass =
          f.status === "REORDER_NOW"
            ? "inventory-reorder"
            : f.status === "LOW"
              ? "inventory-low"
              : "inventory-ok";
        const displayName = nameWithCategoryEmoji(p.name, p.category);
        return `<article class="product-item ${rowClass}"><div><h3>${escape(displayName)}</h3><p>${escape(p.category)}</p></div><div class="product-metrics"><span><small>Stock</small>${p.currentStock} units</span><span><small>Unit cost</small>₹${Number(p.unitCost).toFixed(2)}</span><b class="${cls}">${label}</b><button class="product-delete" type="button" data-product-id="${p.id}" aria-label="Delete ${escape(p.name)}" title="Delete product">×</button></div></article>`;
      })
      .join("");
  }
  document
    .getElementById("product-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const get = (id) => document.getElementById(id).value.trim();
      const stock = Number(get("product-stock")),
        lead = Number(get("product-leadtime")),
        cost = Number(get("product-cost"));
      const category = get("product-category");
      if (
        !get("product-name") ||
        !category ||
        stock < 0 ||
        lead < 1 ||
        cost < 0
      )
        return;
      Store.addProduct({
        name: nameWithCategoryEmoji(get("product-name"), category),
        category,
        currentStock: stock,
        leadTimeDays: lead,
        unitCost: cost,
      });
      this.reset();
      render();
      toast("Product added successfully");
    });
  document.getElementById("inventory-search").addEventListener("input", render);
  document
    .getElementById("inventory-list")
    .addEventListener("click", function (event) {
      const button = event.target.closest(".product-delete");
      if (!button) return;
      if (window.confirm("Delete this product and its sales history?")) {
        Store.removeProduct(button.dataset.productId);
        render();
        toast("Product deleted");
      }
    });
  render();
})();
