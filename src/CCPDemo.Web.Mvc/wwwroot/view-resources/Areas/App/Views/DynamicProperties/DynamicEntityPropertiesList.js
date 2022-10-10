(function () {
  $(function () {
    var _table = $('#DynamicEntityPropertiesTable');
    var _dynamicEntityPropertyAppService = abp.services.app.dynamicEntityProperty;
    var _initialized = false;
    var _dataTable;

    var _selectAnEntity = new app.ModalManager({
      viewUrl: abp.appPath + 'App/DynamicProperty/SelectAnEntityModal',
      scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/DynamicProperties/_SelectAnEntityModal.js',
      modalClass: 'SelectAnEntityForDynamicPropertyModal',
      cssClass: 'scrollable-modal',
    });

    var _permissions = {
      edit: abp.auth.hasPermission('Pages.Administration.DynamicEntityPropertyValue.Edit'),
    };

    var _manageDynamicEntityPropertyModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/DynamicEntityProperty/ManageModal',
      scriptUrl:
        abp.appPath + 'view-resources/Areas/App/Views/_Bundles/dynamic-entity-properties-manage-modal.min.js',
      modalClass: 'ManageDynamicEntityPropertyModal',
      cssClass: 'scrollable-modal',
    });

    function initializeTable() {
      if (_initialized) {
        return;
      }
      _initialized = true;

      _dataTable = _table.DataTable({
        paging: false,
        serverSide: false,
        processing: false,
        listAction: {
          ajaxFunction: _dynamicEntityPropertyAppService.getAllEntitiesHasDynamicProperty,
        },
        columnDefs: [
          {
            className: 'control responsive',
            orderable: false,
            render: function () {
              return '';
            },
            targets: 0,
          },
          {
            targets: 1,
            data: null,
            orderable: false,
            defaultContent: '',
            visible: _permissions.edit,
            rowAction: {
              element: $('<button/>')
                .addClass('btn btn-primary')
                .text(app.localize('Detail'))
                .click(function () {
                  _manageDynamicEntityPropertyModal.open({ entityFullName: $(this).data().entityFullName });
                }),
            },
          },
          {
            targets: 2,
            data: 'entityFullName',
          },
        ],
      });
    }

    $('#CreateNewDynamicEntityProperty').click(function () {
      _selectAnEntity.open({
        onSelected: function (entityFullName) {
          if (!entityFullName) {
            return;
          }
          _manageDynamicEntityPropertyModal.open({ entityFullName: entityFullName });
        },
      });
    });

    $('#btnDynamicEntityPropertyTab').on('shown.bs.tab', function (e) {
      initializeTable();
    });

    abp.event.on('app.dynamic-entity-property.removed-from-entity', function () {
      if (!_initialized) {
        return;
      }
      _dataTable.ajax.reload();
    });

    abp.event.on('app.createOrEditDynamicEntityPropertiesModalSaved', function () {
      if (!_initialized) {
        return;
      }
      _dataTable.ajax.reload();
    });
  });
})();
