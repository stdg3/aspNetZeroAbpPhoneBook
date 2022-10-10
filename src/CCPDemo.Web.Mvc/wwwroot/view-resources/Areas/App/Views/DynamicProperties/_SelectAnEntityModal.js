(function () {
  app.modals.SelectAnEntityForDynamicPropertyModal = function () {
    var _modalManager;
    var _args;

    this.init = function (modalManager) {
      _modalManager = modalManager;
      _args = modalManager.getArgs();
    };

    this.save = function () {
      var entityFullName = _modalManager.getModal().find('select[name=entityFullName]').val();
      if (_args.onSelected) {
        _args.onSelected(entityFullName);
      }
      _modalManager.close();
    };
  };
})();
