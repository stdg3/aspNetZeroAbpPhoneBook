(function () {
  app.modals.PermissionTreeModal = function () {
    var _modalManager;
    var _permissionsTree = null;

    var _options = {
      onSelectionDone: function () {},
    };

    this.init = function (modalManager) {
      _modalManager = modalManager;
      _options = $.extend(_options, _modalManager.getOptions().options);

      _permissionsTree = new PermissionsTree();
      _permissionsTree.init(
        _modalManager.getModal().find('#PermissionFilterTree .permission-tree'),
        _modalManager.getOptions().options
      );

      _modalManager.onBeforeClose(function () {
        if (typeof _options.onSelectionDone == 'function') {
          _options.onSelectionDone(_permissionsTree.getSelectedPermissionNames());
        }
      });
    };
  };

  app.modals.PermissionTreeModal.create = function (options) {
    return new app.ModalManager({
      viewUrl: abp.appPath + 'App/Common/PermissionTreeModal',
      scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Common/Modals/_PermissionTreeModal.js',
      modalClass: 'PermissionTreeModal',
      options: options,
      removeAllOnCloseBindsAfterModalClose: true,
    });
  };
})();
