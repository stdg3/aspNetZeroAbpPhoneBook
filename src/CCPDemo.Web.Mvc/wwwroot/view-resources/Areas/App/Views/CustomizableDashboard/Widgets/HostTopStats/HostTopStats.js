(function () {
  app.widgets.Widgets_Host_TopStats = function () {
    var _hostDashboardService = abp.services.app.hostDashboard;
    var _widgetBase = app.widgetBase.create();

    var _widget;
    var _$newTenantsStatusTitle;
    var _$newTenantsStatisticsCountPlaceholder;
    var _$newSubscriptionAmountTitle;
    var _$newSubscriptionAmountPlaceholder;
    var _$dashboardStatisticsPlaceholder1;
    var _$dashboardStatisticsPlaceholder2;
    var _$counterUp;

    var _selectedDateRange = {
      startDate: moment().add(-7, 'days').startOf('day'),
      endDate: moment().endOf('day'),
    };

    this.init = function (widgetManager) {
      _widget = widgetManager.getWidget();

      _$newTenantsStatusTitle = _widget.find('.new-tenants-statistics .status-title');
      _$newTenantsStatisticsCountPlaceholder = _widget.find('.new-tenants-statistics .new-tenants-count');
      _$newSubscriptionAmountTitle = _widget.find('.new-subscription-statistics .status-title');
      _$newSubscriptionAmountPlaceholder = _widget.find('.new-subscription-statistics .new-subscription-amount');
      _$dashboardStatisticsPlaceholder1 = _widget.find('.dashboard-statistics1 .dashboard-placeholder1');
      _$dashboardStatisticsPlaceholder2 = _widget.find('.dashboard-statistics2 .dashboard-placeholder2');
      _$counterUp = _widget.find('.counterup');
      _widgetBase.runDelayed(getTopStatsData);
    };

    var getCurrentDateRangeText = function () {
      return _selectedDateRange.startDate.format('L') + ' - ' + _selectedDateRange.endDate.format('L');
    };

    var writeNewTenantsCount = function (newTenantsCount) {
      _$newTenantsStatusTitle.text(getCurrentDateRangeText());
      _$newTenantsStatisticsCountPlaceholder.text(newTenantsCount);
    };

    var writeNewSubscriptionsAmount = function (newSubscriptionAmount) {
      _$newSubscriptionAmountTitle.text(getCurrentDateRangeText());
      _$newSubscriptionAmountPlaceholder.text(newSubscriptionAmount);
    };

    //this is a sample placeholder. You can put your own statistics here.
    var writeDashboardPlaceholder1 = function (value) {
      _$dashboardStatisticsPlaceholder1.text(value);
    };

    //this is a sample placeholder. You can put your own statistics here.
    var writeDashboardPlaceholder2 = function (value) {
      _$dashboardStatisticsPlaceholder2.text(value);
    };

    var animateCounterUpNumbers = function () {
      _$counterUp.counterUp();
    };

    var getTopStatsData = function () {
      abp.ui.setBusy(_widget);
      _hostDashboardService
        .getTopStatsData({
          startDate: _selectedDateRange.startDate,
          endDate: _selectedDateRange.endDate,
        })
        .done(function (result) {
          writeNewTenantsCount(result.newTenantsCount);
          writeNewSubscriptionsAmount(result.newSubscriptionAmount);
          writeDashboardPlaceholder1(result.dashboardPlaceholder1);
          writeDashboardPlaceholder2(result.dashboardPlaceholder2);
          animateCounterUpNumbers();
        })
        .always(function () {
          abp.ui.clearBusy(_widget);
        });
    };

    abp.event.on('app.dashboardFilters.DateRangePicker.OnDateChange', function (dateRange) {
      if (
        !_widget ||
        !dateRange ||
        (_selectedDateRange.startDate === dateRange.startDate && _selectedDateRange.endDate === dateRange.endDate)
      ) {
        return;
      }
      _selectedDateRange.startDate = dateRange.startDate;
      _selectedDateRange.endDate = dateRange.endDate;

      _widgetBase.runDelayed(getTopStatsData);
    });
  };
})();
