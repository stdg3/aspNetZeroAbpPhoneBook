(function () {
  app.modals.CreateOrEditDynamicPropertyModal = function () {
    var _modalManager;
    var _dynamicPropertyAppServices = abp.services.app.dynamicProperty;

    var _$permissionFilterModal = app.modals.PermissionTreeModal.create({
      singleSelect: true,
      onSelectionDone: function (filteredPermissions) {
        if (filteredPermissions && filteredPermissions.length > 0) {
          _modalManager.getModal().find('input[name=permission]').val(filteredPermissions[0]);
        }
      },
    });

    this.init = function (modalManager) {
      _modalManager = modalManager;
    };

    this.save = function () {
      var dynamicProperty = {
        id: _modalManager.getModal().find('input[name=Id]').val(),
        propertyName: _modalManager.getModal().find('input[name=propertyName]').val(),
        displayName: _modalManager.getModal().find('input[name=displayName]').val(),
        permission: _modalManager.getModal().find('input[name=permission]').val(),
        inputType: _modalManager.getModal().find('select[name=inputType]').val(),
      };

      if (dynamicProperty.propertyName.trim() === '') {
        abp.notify.success(app.localize('XCanNotBeNullOrEmpty', app.localize('PropertyName')));
        return;
      }
      _modalManager.setBusy(true);

      if (dynamicProperty.id) {
        _dynamicPropertyAppServices
          .update(dynamicProperty)
          .done(function () {
            abp.notify.info(app.localize('SavedSuccessfully'));
            _modalManager.close();
            abp.event.trigger('app.createOrEditDynamicPropertyModalSaved');
          })
          .always(function () {
            _modalManager.setBusy(false);
          });
      } else {
        _dynamicPropertyAppServices
          .add(dynamicProperty)
          .done(function () {
            abp.notify.info(app.localize('SavedSuccessfully'));
            _modalManager.close();
            abp.event.trigger('app.createOrEditDynamicPropertyModalSaved');
          })
          .always(function () {
            _modalManager.setBusy(false);
          });
      }
    };

    $('#FilterByPermissionsButton').click(function () {
      _$permissionFilterModal.open({ grantedPermissionNames: [] });
    });
  };
})();
