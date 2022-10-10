$(function () {
  var _$container = $('.date-range-filter-container');
  var _$dateRangePickerInput = _$container.find('#date-range-filter');
  var _$dateRangePickerOpenButton = _$container.find('#btnDateRangeFilterOpen');

  var _startSettings = {
    startDate: moment().add(-7, 'days').startOf('day'),
    endDate: moment().endOf('day'),
    opens: 'bottom',
  };

  var _selectedDateRange = {
    startDate: _startSettings.startDate,
    endDate: _startSettings.endDate,
  };

  var refreshAllData = function () {
    abp.event.trigger('app.dashboardFilters.DateRangePicker.OnDateChange', _selectedDateRange);
  };

  _$dateRangePickerInput.val(
    _selectedDateRange.startDate.format('LL') + ' - ' + _selectedDateRange.endDate.format('LL')
  );

  _$dateRangePicker = _$dateRangePickerInput.daterangepicker(
    $.extend(true, app.createDateRangePickerOptions(), _startSettings),
    function (start, end, label) {
      _selectedDateRange.startDate = start;
      _selectedDateRange.endDate = end;
      refreshAllData();
    }
  );

  _$dateRangePickerOpenButton.click(function () {
    _$dateRangePicker.data('daterangepicker').toggle();
  });
});
