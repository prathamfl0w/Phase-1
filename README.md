# Inventory Reorder Point & Demand Forecasting Tool

A small-business inventory prototype that predicts **when to reorder
stock** using historical sales demand instead of relying only on a fixed
low-stock threshold.

The key idea is that two products with the same amount of stock may need
very different reorder decisions if they sell at different rates. The
Phase 1 prototype demonstrates this using plain HTML, CSS, JavaScript,
and LocalStorage.

## Phase 1

Phase 1 is a working browser-based prototype built with:

-   HTML
-   CSS
-   JavaScript
-   LocalStorage

No backend or database is required for this phase.

## Features

-   Add inventory products
-   Record sales
-   Automatically reduce current stock when a sale is recorded
-   Store products and sales using LocalStorage
-   Calculate average daily demand
-   Calculate demand standard deviation
-   Calculate safety stock
-   Calculate reorder point
-   Calculate days of stock left
-   Calculate suggested order quantity
-   Classify inventory as:
    -   `REORDER_NOW`
    -   `LOW`
    -   `OK`
-   Change the forecasting window between 7, 14, 30, and 60 days
-   Display inventory statistics
-   Load realistic demonstration data
-   Clear stored data
-   Keep data after refreshing the browser

## Forecasting Logic

The forecasting engine uses daily sales history for the selected number
of days. Days with no sales are counted as zero demand.

### Average Daily Demand

``` text
avgDailyDemand = mean(daily sales series)
```

### Safety Stock

The prototype uses:

``` text
safetyStock = z × demandStdDev × √leadTimeDays
```

The default value of `z` is:

``` text
z = 1.65
```

### Reorder Point

``` text
reorderPoint =
(avgDailyDemand × leadTimeDays) + safetyStock
```

### Days of Stock Left

``` text
daysOfStockLeft =
currentStock / avgDailyDemand
```

If there is no demand, `daysOfStockLeft` remains `null` instead of
dividing by zero.

### Suggested Order Quantity

``` text
suggestedOrderQty =
ceil(
  avgDailyDemand × (leadTimeDays + reviewPeriodDays)
  + safetyStock
  - currentStock
)
```

The result is never below zero.

## Data Structure

### Product

``` text
{
  id,
  name,
  category,
  currentStock,
  leadTimeDays,
  unitCost
}
```

### Sale Record

``` text
{
  id,
  productId,
  quantity,
  saleDate
}
```

In Phase 1, `saleDate` uses the format:

``` text
YYYY-MM-DD
```

### Forecast Row

``` text
{
  productId,
  name,
  currentStock,
  leadTimeDays,
  avgDailyDemand,
  demandStdDev,
  safetyStock,
  reorderPoint,
  daysOfStockLeft,
  suggestedOrderQty,
  status,
  salesCountInWindow
}
```

## Project Structure

``` text
phase1/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── storage.js
    ├── forecast.js
    ├── app.js
    └── demo-data.js
```

The exact project structure may vary depending on the final
implementation, but the Phase 1 prototype uses separate files for the
page, styling, storage layer, forecasting engine, page integration, and
demonstration data.

## Demo Data

The demo-data module creates approximately 60 days of realistic sales
history for six products.

The products are designed to demonstrate different forecasting
situations:

1.  A fast-moving product with low stock and a long lead time that
    should require immediate reordering.
2.  A fast-moving product with plenty of stock that should remain
    healthy.
3.  A slow-selling product with moderate stock.
4.  An erratic product with large sales spikes, demonstrating how demand
    variation increases safety stock.
5.  A new product with stock but no sales history.
6.  A seasonal product whose recent sales differ significantly from its
    older sales.

The demo data uses dates generated relative to the current date rather
than hard-coded dates.

## How to Run

1.  Clone the repository.
2.  Open the project in VS Code.
3.  Open `phase1/index.html` using a local development server such as VS
    Code Live Server.
4.  Open the application in a browser.
5.  Use **Load Demo Data** to populate the dashboard.
6.  Test adding products and recording sales.
7.  Change the forecast window to see how the results respond to
    different demand periods.

## Testing Checklist

Before evaluation, verify the following:

-   The dashboard loads without console errors.
-   A new product can be added.
-   A product appears in the forecast table after being added.
-   A sale can be recorded.
-   Recording a sale reduces the product's stock.
-   Forecast values update after sales are recorded.
-   A product can become `REORDER_NOW` when its stock falls below its
    reorder point.
-   Products are ordered with `REORDER_NOW` first, then `LOW`, then
    `OK`.
-   Changing the forecast window changes the calculated values.
-   Reloading the browser keeps the stored data.
-   Clearing the data removes the stored inventory and sales.
-   Demo data displays all important inventory statuses.
-   The application works at a narrow mobile width.
-   No important content overflows horizontally.

## Team Contributions

This project is developed by a three-member team.

  -----------------------------------------------------------------------
  Team Member                         Contribution
  ----------------------------------- -----------------------------------
  Member 1                            Phase 1 page structure, interface,
                                      and styling

  Member 2                            LocalStorage data layer and
                                      forecasting calculations

  Member 3                            Page integration, application flow,
                                      and demonstration data
  -----------------------------------------------------------------------

The GitHub repository contains individual commits and branches where
appropriate so that each team member's contribution is visible.

## Technologies

-   HTML5
-   CSS3
-   JavaScript
-   Browser LocalStorage

## Phase 1 Scope

Phase 1 focuses on proving the inventory forecasting concept through a
working browser prototype.

Later project phases may move the same forecasting concepts to a backend
and database architecture, but those components are outside the scope of
this Phase 1 evaluation.

## Project Goal

The main goal is to replace a simple static low-stock alert with a
demand-based reorder decision.

For example, two products may both have 40 units in stock. If one sells
approximately 1 unit per day and another sells approximately 12 units
per day, they should not receive the same reorder recommendation. The
forecasting engine uses sales velocity, demand variation, stock level,
and supplier lead time to make that distinction.
