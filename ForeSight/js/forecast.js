window.Forecast = {
    buildDailyDemandSeries: function(sales, windowDays, todayISO) {
        const series = new Array(windowDays).fill(0);
        const todayDate = new Date(todayISO);
        
        for (let i = 0; i < sales.length; i++) {
            const sale = sales[i];
            const saleDate = new Date(sale.saleDate);
            const diffTime = todayDate.getTime() - saleDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
            
            if (diffDays >= 0 && diffDays < windowDays) {
                series[windowDays - 1 - diffDays] += sale.quantity;
            }
        }
        return series;
    },

    average: function(numbers) {
        if (numbers.length === 0) return 0;
        let sum = 0;
        for (let i = 0; i < numbers.length; i++) {
            sum += numbers[i];
        }
        return sum / numbers.length;
    },

    standardDeviation: function(numbers) {
        if (numbers.length === 0) return 0;
        const avg = this.average(numbers);
        let sumSqDiff = 0;
        for (let i = 0; i < numbers.length; i++) {
            const diff = numbers[i] - avg;
            sumSqDiff += diff * diff;
        }
        return Math.sqrt(sumSqDiff / numbers.length);
    },

    calculateForecast: function(options) {
        const sales = options.sales;
        const currentStock = options.currentStock;
        const leadTimeDays = options.leadTimeDays;
        const windowDays = options.windowDays !== undefined ? options.windowDays : 30;
        const z = options.z !== undefined ? options.z : 1.65;
        const reviewPeriodDays = options.reviewPeriodDays !== undefined ? options.reviewPeriodDays : 14;
        const todayISO = options.todayISO;

        const series = this.buildDailyDemandSeries(sales, windowDays, todayISO);
        const avgDailyDemand = this.average(series);
        const demandStdDev = this.standardDeviation(series);
        const safetyStock = z * demandStdDev * Math.sqrt(leadTimeDays);
        const reorderPoint = (avgDailyDemand * leadTimeDays) + safetyStock;
        const daysOfStockLeft = avgDailyDemand > 0 ? currentStock / avgDailyDemand : null;
        
        const suggestedOrderQty = Math.max(0, Math.ceil(
            avgDailyDemand * (leadTimeDays + reviewPeriodDays) + safetyStock - currentStock
        ));
        
        let salesCountInWindow = 0;
        const todayDate = new Date(todayISO);
        for (let i = 0; i < sales.length; i++) {
            const saleDate = new Date(sales[i].saleDate);
            const diffTime = todayDate.getTime() - saleDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
            if (diffDays >= 0 && diffDays < windowDays) {
                salesCountInWindow++;
            }
        }

        let status = "OK";
        if (currentStock <= reorderPoint) {
            status = "REORDER_NOW";
        } else if (currentStock <= reorderPoint * 1.25) {
            status = "LOW";
        }

        return {
            avgDailyDemand: Math.round(avgDailyDemand * 10) / 10,
            demandStdDev: Math.round(demandStdDev * 10) / 10,
            safetyStock: Math.ceil(safetyStock),
            reorderPoint: Math.ceil(reorderPoint),
            daysOfStockLeft: daysOfStockLeft !== null ? Math.round(daysOfStockLeft) : null,
            suggestedOrderQty: suggestedOrderQty,
            status: status,
            salesCountInWindow: salesCountInWindow,
            windowDays: windowDays
        };
    }
};
