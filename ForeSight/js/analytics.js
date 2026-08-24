(function () {
  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/svg+xml";
  favicon.href = "favicon.svg";
  document.head.appendChild(favicon);

  const iso = () => new Date().toISOString().split("T")[0];
  const statusClass = (status) =>
    status === "REORDER_NOW"
      ? "status-reorder"
      : status === "LOW"
        ? "status-low"
        : "status-ok";
  const label = (status) =>
    status === "REORDER_NOW"
      ? "Reorder now"
      : status === "LOW"
        ? "Running low"
        : "Healthy";

  const escapeHtml = (value) =>
    String(value).replace(
      /[&<>'"]/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[character],
    );

  const dateLabel = (date) =>
    date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const formatWhole = (value) => Number(value).toLocaleString("en-IN");
  const formatDemand = (value) =>
    Number(value).toLocaleString("en-IN", { maximumFractionDigits: 1 });

  function render() {
    const days = Number(document.getElementById("analytics-window").value),
      products = Store.getProducts(),
      sales = Store.getSales(),
      today = iso();
    const rows = products
      .map((p) => {
        const productSales = Store.getSalesForProduct(p.id);
        const productSeries = Forecast.buildDailyDemandSeries(
          productSales,
          days,
          today,
        );

        return {
          p,
          f: Forecast.calculateForecast({
            sales: productSales,
            currentStock: p.currentStock,
            leadTimeDays: p.leadTimeDays,
            windowDays: days,
            todayISO: today,
          }),
          unitsSold: productSeries.reduce((sum, value) => sum + value, 0),
        };
      })
      .sort(
        (a, b) =>
          b.unitsSold - a.unitsSold || b.f.avgDailyDemand - a.f.avgDailyDemand,
      );
    const series = Forecast.buildDailyDemandSeries(sales, days, today);
    const totalSales = series.reduce((sum, value) => sum + value, 0);
    const best = rows[0];
    const value = products.reduce(
      (sum, p) => sum + Number(p.currentStock) * Number(p.unitCost),
      0,
    );
    document.getElementById("analytics-sales").textContent =
      formatWhole(totalSales);
    document.getElementById("analytics-demand").textContent = formatDemand(
      totalSales / days,
    );
    document.getElementById("analytics-best").textContent =
      best && best.f.avgDailyDemand > 0 ? best.p.name : "—";
    document.getElementById("analytics-value").textContent =
      `₹${formatWhole(value)}`;
    document
      .getElementById("analytics-empty")
      .classList.toggle("hidden", products.length > 0);
    document.getElementById("analytics-body").innerHTML = rows
      .map(
        ({ p, f, unitsSold }) =>
          `<tr class="${statusClass(f.status)}">
            <td>${escapeHtml(p.name)}</td>
            <td>${formatWhole(unitsSold)}</td>
            <td>${formatDemand(f.avgDailyDemand)}</td>
            <td>${f.daysOfStockLeft === null ? "No sales yet" : `${formatWhole(f.daysOfStockLeft)} days`}</td>
            <td><span class="${statusClass(f.status)}">${label(f.status)}</span></td>
          </tr>`,
      )
      .join("");
    const peakDemand = Math.max(...series, 0);
    const max = Math.max(peakDemand, 1);
    document.getElementById("trend-chart").innerHTML = series
      .map(
        (value, index) =>
          `<span title="Day ${index + 1}: ${formatWhole(value)} units" style="height:${Math.max(4, (value / max) * 100)}%"></span>`,
      )
      .join("");
    document.getElementById("trend-peak").textContent = `${formatWhole(peakDemand)} ${
      peakDemand === 1 ? "unit" : "units"
    }`;
    document.getElementById("trend-active-days").textContent = series.filter(
      (value) => value > 0,
    ).length;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    document.getElementById("trend-start").textContent = dateLabel(startDate);

    const urgent = rows.filter((row) => row.f.status === "REORDER_NOW");
    const low = rows.filter((row) => row.f.status === "LOW");
    const high = rows
      .slice()
      .sort((a, b) => b.f.demandStdDev - a.f.demandStdDev)[0];
    document.getElementById("insights-list").innerHTML = products.length
      ? `<article class="insight-item insight-primary">
          <span>Top seller</span>
          <strong>${best && best.unitsSold > 0 ? escapeHtml(best.p.name) : "No sales recorded yet"}</strong>
          <small>${best && best.unitsSold > 0 ? `${formatWhole(best.unitsSold)} units sold in ${days} days` : "Log a sale to start tracking demand."}</small>
        </article>
        <article class="insight-item">
          <span>Inventory attention</span>
          <strong>${formatWhole(urgent.length)} reorder now · ${formatWhole(low.length)} running low</strong>
          <small>${urgent.length ? `${escapeHtml(urgent[0].p.name)} should be reviewed first.` : "No products need an immediate reorder."}</small>
        </article>
        <article class="insight-item">
          <span>Demand variation</span>
          <strong>${high ? escapeHtml(high.p.name) : "—"}</strong>
          <small>${high ? `Demand standard deviation: ${formatDemand(high.f.demandStdDev)}` : "Add products to compare demand patterns."}</small>
        </article>`
      : "";
  }
  document
    .getElementById("analytics-window")
    .addEventListener("change", render);
  document
    .getElementById("analytics-refresh")
    .addEventListener("click", () => window.location.reload());
  window.addEventListener("storage", render);
  render();
})();
