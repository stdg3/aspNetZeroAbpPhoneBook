(function () {
  app.widgets.Widgets_Host_SubscriptionExpiringTenants = function () {
    var _hostDashboardService = abp.services.app.hostDashboard;

    var _widget;
    var _$expiringTenantsTable;
    var _$seeAllExpiringTenantsButton;
    var _$expiringTenantsCaptionHelper;

    this.init = function (widgetManager) {
      _widget = widgetManager.getWidget();
      _$expiringTenantsTable = _widget.find('.expiring-tenants-table');
      _$seeAllExpiringTenantsButton = _widget.find('.see-all-expiring-tenants');
      _$expiringTenantsCaptionHelper = _widget.find('.sub-title');

      initialize();
    };

    var populateExpiringTenantsTable = function (
      subscriptionEndAlertDayCount,
      maxExpiringTenantsShownCount,
      subscriptionEndDateStart,
      subscriptionEndDateEnd
    ) {
      _$expiringTenantsCaptionHelper.text(
        app.localize('ExpiringTenantsHelpText', subscriptionEndAlertDayCount, maxExpiringTenantsShownCount)
      );

      _$seeAllExpiringTenantsButton
        .data('subscriptionEndDateStart', subscriptionEndDateStart)
        .data('subscriptionEndDateEnd', subscriptionEndDateEnd)
        .click(function () {
          window.open(
            abp.appPath +
              'App/Tenants?' +
              'subscriptionEndDateStart=' +
              encodeURIComponent($(this).data('subscriptionEndDateStart')) +
              '&' +
              'subscriptionEndDateEnd=' +
              encodeURIComponent($(this).data('subscriptionEndDateEnd'))
          );
        });
    };

    function initialize() {
      abp.ui.setBusy(_widget);
      _hostDashboardService
        .getSubscriptionExpiringTenantsData()
        .done(function (result) {
          populateExpiringTenantsTable(
            result.subscriptionEndAlertDayCount,
            result.maxExpiringTenantsShownCount,
            result.subscriptionEndDateStart,
            result.subscriptionEndDateEnd
          );
          initializeSubscriptionExpiringTenantsTable(result.expiringTenants);
        })
        .always(function () {
          abp.ui.clearBusy(_widget);
        });
    }

    function initializeSubscriptionExpiringTenantsTable(subscriptionExpiredTenants) {
      _$expiringTenantsTable.DataTable({
        paging: false,
        serverSide: false,
        processing: false,
        info: false,
        ajax: function (data, callback, settings) {
          callback({ data: subscriptionExpiredTenants });
        },
        columnDefs: [
          {
            targets: 0,
            data: 'tenantName',
          },
          {
            targets: 1,
            data: 'remainingDayCount',
          },
        ],
      });
    }
  };
})();
