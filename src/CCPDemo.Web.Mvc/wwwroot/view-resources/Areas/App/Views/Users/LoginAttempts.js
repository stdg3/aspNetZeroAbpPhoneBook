(function () {
  $(function () {
    var _$loginAttemptsTable = $('#LoginAttemptsTable');
    var _$auditLogFilterForm = $('#LoginAttemptsTable');
    var _userLoginService = abp.services.app.userLogin;
    var _selectedDateRang = {
      startDate: moment().startOf('week'),
      endDate: moment().endOf('day'),
    };

    var dataTable = _$loginAttemptsTable.DataTable({
      paging: true,
      serverSide: true,
      processing: true,
      drawCallback: function (settings) {
        $('[data-toggle=tooltip]').tooltip();
      },
      listAction: {
        ajaxFunction: _userLoginService.getUserLoginAttempts,
        inputFilter: function () {
          return {
            filter: $('#LoginAttemptsFilter').val(),
            result: $('#LoginResultFilter').val(),
            startDate: _selectedDateRang.startDate,
            endDate: _selectedDateRang.endDate,
          };
        },
      },
      columnDefs: [
        {
          targets: 0,
          data: 'clientIpAddress',
        },
        {
          targets: 1,
          data: 'clientName',
        },
        {
          targets: 2,
          data: 'browserInfo',
        },
        {
          targets: 3,
          data: 'creationTime',
          render: function (creationTime) {
            return moment(creationTime).format('L');
          },
        },
        {
          targets: 4,
          data: 'result',
          render: function (result) {
            if (result === 'Success') {
              return '<span class="text-success">' + app.localize('AbpLoginResultType_' + result) + '</span>';
            }

            return '<span class="text-warning">' + app.localize('AbpLoginResultType_' + result) + '</span>';
          },
        },
      ],
    });

    $('#RefreshLoginAttempts, #GetLoginAttemptsButton').click(function (e) {
      e.preventDefault();
      getLoginAttempts();
    });

    $('#StartEndRange').daterangepicker(
      $.extend(true, app.createDateRangePickerOptions(), _selectedDateRang),
      function (start, end) {
        _selectedDateRang.startDate = start.format('YYYY-MM-DDT00:00:00Z');
        _selectedDateRang.endDate = end.format('YYYY-MM-DDT23:59:59.999Z');

        getLoginAttempts();
      }
    );

    function getLoginAttempts() {
      dataTable.ajax.reload();
    }
  });
})();
