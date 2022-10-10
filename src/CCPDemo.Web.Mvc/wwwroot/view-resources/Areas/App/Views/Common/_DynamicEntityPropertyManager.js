var DynamicEntityPropertyManager = (function () {
  return function () {
    let _entityNamesHasDynamicProperty = [];
    let _dynamicEntityPropertyAppService = abp.services.app.dynamicEntityProperty;

    let _getPermission = abp.auth.hasPermission('Pages.Administration.DynamicEntityProperties');
    let _editPermission = abp.auth.hasPermission('Pages.Administration.DynamicEntityPropertyValue.Edit');

    let _dynamicPropertiesModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/DynamicEntityPropertyValues/ManageDynamicEntityPropertyValuesModal',
      scriptUrl:
        abp.appPath +
        'view-resources/Areas/App/Views/_Bundles/manage-dynamic-entity-property-values-modal.min.js',
      modalClass: 'ManageDynamicEntityPropertyValuesModal',
    });

    function getAllEntityNames() {
      if (!hasPermission()) {
        return;
      }

      _dynamicEntityPropertyAppService.getAllEntitiesHasDynamicProperty().done(function (result) {
        if (result.items) {
          _entityNamesHasDynamicProperty = result.items.map((i) => i.entityFullName);
        }
      });
    }

    function hasPermission() {
      return _getPermission && _editPermission;
    }

    function hasEntity(entityName) {
      return _entityNamesHasDynamicProperty.indexOf(entityName) > -1;
    }

    function canShow(entityName) {
      return hasPermission() && hasEntity(entityName);
    }

    getAllEntityNames();

    return {
      canShow: canShow,
      hasEntity: hasEntity,
      hasPermission: hasPermission,
      modal: _dynamicPropertiesModal,
    };
  };
})();
