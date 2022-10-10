(function () {
  app.widgets.Widgets_Tenant_GeneralStats = function () {
    var _tenantDashboardService = abp.services.app.tenantDashboard;
    var _widget;
    this.init = function (widgetManager) {
      _widget = widgetManager.getWidget();
      getDashboardData();
    };

    var initGeneralStats = function (transactionPercent, newVisitPercent, bouncePercent) {
      //General stats =>  EasyPieChart: https://rendro.github.io/easy-pie-chart/

      var init = function (transactionPercent, newVisitPercent, bouncePercent) {
        _widget.find('#transactionPercent').attr('data-percent', transactionPercent);
        _widget.find('#transactionPercent span').text(transactionPercent);
        _widget.find('#newVisitPercent').attr('data-percent', newVisitPercent);
        _widget.find('#newVisitPercent span').text(newVisitPercent);
        _widget.find('#bouncePercent').attr('data-percent', bouncePercent);
        _widget.find('#bouncePercent span').text(bouncePercent);
        _widget.find('.easy-pie-chart-loading').hide();
      };

      var refreshGeneralStats = function (transactionPercent, newVisitPercent, bouncePercent) {
        _widget.find('#transactionPercent').data('easyPieChart').update(transactionPercent);
        _widget.find('#transactionPercent span').text(transactionPercent);
        _widget.find('#newVisitPercent').data('easyPieChart').update(newVisitPercent);
        _widget.find('#newVisitPercent span').text(newVisitPercent);
        _widget.find('#bouncePercent').data('easyPieChart').update(bouncePercent);
        _widget.find('#bouncePercent span').text(bouncePercent);
      };

      var createPieCharts = function () {
        _widget.find('.easy-pie-chart .number.transactions').easyPieChart({
          animate: 1000,
          size: 75,
          lineWidth: 3,
          barColor: '#ffb822',
        });

        _widget.find('.easy-pie-chart .number.visits').easyPieChart({
          animate: 1000,
          size: 75,
          lineWidth: 3,
          barColor: '#36a3f7',
        });

        _widget.find('.easy-pie-chart .number.bounce').easyPieChart({
          animate: 1000,
          size: 75,
          lineWidth: 3,
          barColor: '#f4516c',
        });
      };

      _widget.find('#generalStatsReload').click(function () {
        _tenantDashboardService.getGeneralStats({}).done(function (result) {
          refreshGeneralStats(result.transactionPercent, result.newVisitPercent, result.bouncePercent);
        });
      });

      init(transactionPercent, newVisitPercent, bouncePercent);
      createPieCharts();
    };

    var getDashboardData = function () {
      _tenantDashboardService.getGeneralStats().done(function (result) {
        initGeneralStats(result.transactionPercent, result.newVisitPercent, result.bouncePercent);
        _widget.find('.counterup').counterUp();
      });
    };
  };
})();
