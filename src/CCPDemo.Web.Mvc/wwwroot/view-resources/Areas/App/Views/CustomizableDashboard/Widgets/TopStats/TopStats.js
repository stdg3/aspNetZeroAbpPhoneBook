(function () {
  app.widgets.Widgets_Tenant_TopStats = function () {
    var _tenantDashboardService = abp.services.app.tenantDashboard;
    var _widget;

    this.init = function (widgetManager) {
      _widget = widgetManager.getWidget();
      getTopStatsData();
    };

    var initDashboardTopStats = function (totalProfit, newFeedbacks, newOrders, newUsers) {
      _widget.find('#totalProfit').text(totalProfit);
      _widget.find('#newFeedbacks').text(newFeedbacks);
      _widget.find('#newOrders').text(newOrders);
      _widget.find('#newUsers').text(newUsers);
      _widget.find('.counterup').counterUp();
    };

    var getTopStatsData = function () {
      _tenantDashboardService.getTopStats().done(function (result) {
        initDashboardTopStats(result.totalProfit, result.newFeedbacks, result.newOrders, result.newUsers);
      });
    };
  };
})();
