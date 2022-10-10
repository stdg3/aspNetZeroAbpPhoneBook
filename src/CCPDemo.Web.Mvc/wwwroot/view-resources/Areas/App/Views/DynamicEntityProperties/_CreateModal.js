(function () {
  app.modals.CreateDynamicEntityPropertyModal = function () {
    var _modalManager;
    var _dynamicEntityPropertyAppService = abp.services.app.dynamicEntityProperty;

    this.init = function (modalManager) {
      _modalManager = modalManager;
    };

    this.save = function () {
      var dynamicEntityProperty = {
        entityFullName: _modalManager.getModal().find('#edp-create-modal-entityFullName').val(),
        dynamicPropertyId: _modalManager.getModal().find('#edp-create-modal-dynamicPropertyId').val(),
      };

      _modalManager.setBusy(true);

      _dynamicEntityPropertyAppService
        .add(dynamicEntityProperty)
        .done(function () {
          abp.notify.info(app.localize('SavedSuccessfully'));
          _modalManager.close();
          abp.event.trigger('app.createOrEditDynamicEntityPropertiesModalSaved');
        })
        .always(function () {
          _modalManager.setBusy(false);
        });
    };
  };
})();
