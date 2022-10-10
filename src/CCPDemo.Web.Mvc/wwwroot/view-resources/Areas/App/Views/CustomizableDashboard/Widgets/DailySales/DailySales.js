(function () {
  app.widgets.Widgets_Tenant_DailySales = function () {
    var _tenantDashboardService = abp.services.app.tenantDashboard;
    var _widgetBase = app.widgetBase.create();
    var _widget;

    this.init = function (widgetManager) {
      _widget = widgetManager.getWidget();
      _widgetBase.runDelayed(getDailySales);

      _widget.find('.DashboardTabList a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
        _widgetBase.runDelayed(getDailySales);
      });
    };

    //== Daily Sales chart.
    //** Based on Chartjs plugin - http://www.chartjs.org/
    var initDailySales = function (data) {
      var dayLabels = [];
      for (var day = 1; day <= data.length; day++) {
        dayLabels.push('Day ' + day);
      }

      var chartData = {
        labels: dayLabels,
        datasets: [
          {
            label: 'Dataset 1',
            backgroundColor: '#34bfa3',
            data: data,
          },
          {
            label: 'Dataset 2',
            backgroundColor: '#f3f3fb',
            data: data,
          },
        ],
      };

      var chartContainer = _widget.find('#m_chart_daily_sales');

      new Chart(chartContainer, {
        type: 'bar',
        data: chartData,
        options: {
          title: {
            display: false,
          },
          tooltips: {
            intersect: false,
            mode: 'nearest',
            xPadding: 10,
            yPadding: 10,
            caretPadding: 10,
          },
          legend: {
            display: false,
            labels: {
              display: false
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          barRadius: 4,
          scales: {
            xAxes: [
              {
                display: false,
                gridLines: false,
                stacked: true,
              },
            ],
            yAxes: [
              {
                display: false,
                stacked: true,
                gridLines: false,
              },
            ],
          },
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            },
          },
        },
      });
    };

    var getDailySales = function () {
      abp.ui.setBusy(_widget);
      _tenantDashboardService
        .getDailySales()
        .done(function (result) {
          initDailySales(result.dailySales);
        })
        .always(function () {
          abp.ui.clearBusy(_widget);
        });
    };

    abp.event.on('app.dashboardFilters.DateRangePicker.OnDateChange', function (_selectedDates) {
      if (!_widget) {
        return;
      }
      _widgetBase.runDelayed(getDailySales);
    });
  };
})();
