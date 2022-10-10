(function () {
  app.widgets.Widgets_Host_RecentTenants = function () {
    var _hostDashboardService = abp.services.app.hostDashboard;

    var _widget;
    var _$recentTenantsTable;
    var _$seeAllRecentTenantsButton;
    var _$recentTenantsCaptionHelper;

    this.init = function (widgetManager) {
      _widget = widgetManager.getWidget();
      _$recentTenantsTable = _widget.find('.recent-tenants-table');
      _$seeAllRecentTenantsButton = _widget.find('.see-all-recent-tenants');
      _$recentTenantsCaptionHelper = _widget.find('.sub-title');

      initialize();
    };

    var initRecentTenantsTableInfo = function (recentTenantsDayCount, maxRecentTenantsShownCount, creationDateStart) {
      _$recentTenantsCaptionHelper.text(
        app.localize('RecentTenantsHelpText', recentTenantsDayCount, maxRecentTenantsShownCount)
      );

      _$seeAllRecentTenantsButton.data('creationDateStart', creationDateStart).click(function () {
        window.open(
          abp.appPath +
            'App/Tenants?' +
            'creationDateStart=' +
            encodeURIComponent($(this).data('creationDateStart'))
        );
      });
    };

    function initialize() {
      abp.ui.setBusy(_widget);
      _hostDashboardService
        .getRecentTenantsData()
        .done(function (result) {
          initRecentTenantsTableInfo(
            result.recentTenantsDayCount,
            result.maxRecentTenantsShownCount,
            result.tenantCreationStartDate
          );
          initRecentTenantsTable(result.recentTenants);
        })
        .always(function () {
          abp.ui.clearBusy(_widget);
        });
    }

    function initRecentTenantsTable(recentTenants) {
      _$recentTenantsTable.DataTable({
        paging: false,
        serverSide: false,
        processing: false,
        info: false,
        ajax: function (data, callback, settings) {
          callback({ data: recentTenants });
        },
        columnDefs: [
          {
            targets: 0,
            data: 'name',
          },
          {
            targets: 1,
            data: 'creationTime',
            render: function (creationTime) {
              return moment(creationTime).format('L LT');
            },
          },
        ],
      });
    }
  };
})();
