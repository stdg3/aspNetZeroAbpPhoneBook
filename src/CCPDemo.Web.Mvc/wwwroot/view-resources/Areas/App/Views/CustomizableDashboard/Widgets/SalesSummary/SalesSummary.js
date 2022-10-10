(function () {
    app.widgets.Widgets_Tenant_SalesSummary = function () {
        var _tenantDashboardService = abp.services.app.tenantDashboard;
        var _widget;

        var salesSummaryDatePeriod = {
            daily: 1,
            weekly: 2,
            monthly: 3,
        };

        this.init = function (widgetManager) {
            _widget = widgetManager.getWidget();
            getSalesSummary();
        };

        var transformChartData = function (data) {
            var labels = [];
            var salesData = {
                label: 'Sales',
                data: [],
                borderColor: '#399a8c',
                backgroundColor: '#399a8c',
                fill: true
            };

            var profitData = {
                label: 'Profit',
                data: [],
                borderColor: '#92e9dc',
                backgroundColor: '#92e9dc',
                fill: true
            };

            for (var i = 0; i < data.length; i++) {
                labels.push(data[i].period);
                salesData.data.push(data[i].sales);
                profitData.data.push(data[i].profit);
            }

            return {
                labels: labels,
                datasets: [salesData, profitData]
            };
        };

        var initSalesSummaryChart = function (salesSummaryData, totalSales, revenue, expenses, growth) {
            var SalesSummaryChart = function () {
                var init = function (salesData) {
                    const data = transformChartData(salesData);

                    const config = {
                        type: 'line',
                        data: data,
                        options: {
                            responsive: true,
                            plugins: {
                                tooltip: {
                                    mode: 'index'
                                },
                            },
                            interaction: {
                                mode: 'nearest',
                                axis: 'x',
                                intersect: false
                            },
                            scales: {
                                y: {
                                    stacked: true
                                }
                            }
                        }
                    };

                    this.graph = new Chart(document.getElementById('salesStatistics'), config);
                };

                var refresh = function (datePeriod) {
                    _tenantDashboardService
                        .getSalesSummary({
                            salesSummaryDatePeriod: datePeriod,
                        })
                        .done(function (result) {
                            this.graph.destroy();
                            init(result.salesSummary);
                        });
                };

                var draw = function (data) {
                    if (!this.graph) {
                        init(data);
                    } else {
                        refresh(data);
                    }
                };

                return {
                    draw: draw,
                    refresh: refresh,
                    graph: this.graph
                };
            };

            _widget.find('#salesStatistics').show();

            var salesSummary = new SalesSummaryChart();
            salesSummary.draw(salesSummaryData);
            
            $(_widget).find("input[name='SalesSummaryDateInterval']").unbind('change');
            $(_widget)
                .find("input[name='SalesSummaryDateInterval']")
                .change(function () {
                    $(this).closest('.btn-group').find('.btn').removeClass('active');
                    $(this).closest('.btn').addClass('active');
                    salesSummary.refresh(this.value);
                });

            _widget.find('#totalSales').text(totalSales);
            _widget.find('#revenue').text(revenue);
            _widget.find('#expenses').text(expenses);
            _widget.find('#growth').text(growth);
            _widget.find('#salesStatisticsLoading').hide();
        };

        var getSalesSummary = function () {
            abp.ui.setBusy(_widget);
            _tenantDashboardService
                .getSalesSummary({
                    salesSummaryDatePeriod: salesSummaryDatePeriod.daily,
                })
                .done(function (result) {
                    initSalesSummaryChart(result.salesSummary, result.totalSales, result.revenue, result.expenses, result.growth);
                })
                .always(function () {
                    abp.ui.clearBusy(_widget);
                });
        };
    };
})();
