(function ($) {
  var _applicationPrefix = 'Mvc';
  app.modals.AddWidgetModal = function () {
    var _dashboardCustomizationService = abp.services.app.dashboardCustomization;
    var _modalManager;

    this.init = function (modalManager) {
      _modalManager = modalManager;
    };

    this.save = function () {
      var widgetId = $('#WidgetSelect').val();

      _modalManager.setBusy(true);
      _dashboardCustomizationService
        .addWidget({
          widgetId: widgetId,
          dashboardName: $('#DashboardName').val(),
          pageId: $('#PageId').val(),
          height: $('#' + widgetId + 'Height').val(),
          width: $('#' + widgetId + 'Width').val(),
          application: _applicationPrefix,
        })
        .done(function () {
          abp.notify.info(app.localize('AddedSuccessfully'));
          _modalManager.close();

          abp.event.trigger('app.addWidgetModalSaved');
        })
        .always(function () {
          _modalManager.setBusy(false);
        });
    };
  };
})(jQuery);
