(function () {
  app.modals.ManageDynamicEntityPropertyValuesModal = function () {
    var _modalManager;
    var _manageDynamicEntityPropertyValueBase = new ManageDynamicEntityPropertyValueBase();

    this.init = function (modalManager) {
      _modalManager = modalManager;
      initializePage();
    };

    function initializePage() {
      var _table = _modalManager.getModal().find('#DynamicEntityPropertyValuesTable');
      _table.find('tbody').empty();
      _manageDynamicEntityPropertyValueBase.initialize({
        entityFullName: _modalManager.getModal().find('#EntityFullName').val(),
        entityId: _modalManager.getModal().find('#EntityId').val(),
        bodyElement: _table.find('tbody'),
        onDeleteValues: function () {
          initializePage();
        },
      });
    }

    this.save = function () {
      _manageDynamicEntityPropertyValueBase.save(function () {
        _modalManager.close();
      });
    };
  };

  app.modals.ManageDynamicEntityPropertyValuesModal.create = function () {
    return new app.ModalManager({
      viewUrl: abp.appPath + 'App/DynamicEntityPropertyValue/ManageDynamicEntityPropertyValuesModal',
      scriptUrl:
        abp.appPath +
        'view-resources/Areas/App/Views/DynamicEntityPropertyValues/ManageDynamicEntityPropertyValuesModal.js',
      modalClass: 'ManageDynamicEntityPropertyValuesModal',
      cssClass: 'scrollable-modal',
    });
  };
})();
