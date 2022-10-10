(function () {
  $(function () {
    var _table = $('#DynamicPropertiesTable');
    var _dynamicPropertyAppService = abp.services.app.dynamicProperty;
    var _initialized = false;
    var _dataTable;
    var _permissions = {
      edit: abp.auth.hasPermission('Pages.Administration.DynamicProperties.Edit'),
      delete: abp.auth.hasPermission('Pages.Administration.DynamicProperties.Delete'),
      dynamicPropertyValue_edit: abp.auth.hasPermission('Pages.Administration.DynamicPropertyValue.Edit'),
    };

    var _createOrEditModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/DynamicProperty/CreateOrEditModal',
      scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/DynamicProperties/_CreateOrEditModal.js',
      modalClass: 'CreateOrEditDynamicPropertyModal',
      cssClass: 'scrollable-modal',
    });

    var _manageValuesModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/DynamicProperty/ManageValuesModal',
      scriptUrl:
        abp.appPath + 'view-resources/Areas/App/Views/_Bundles/dynamic-properties-manage-values.min.js',
      modalClass: 'ManageDynamicPropertyValueModal',
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
          ajaxFunction: _dynamicPropertyAppService.getAll,
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
            autoWidth: false,
            defaultContent: '',
            rowAction: {
              text:
                '<i class="fa fa-cog"></i> <span class="d-none d-md-inline-block d-lg-inline-block d-xl-inline-block">' +
                app.localize('Actions') +
                '</span> <span class="caret"></span>',
              items: [
                {
                  text: app.localize('Edit'),
                  visible: function (data) {
                    return _permissions.edit;
                  },
                  action: function (data) {
                    _createOrEditModal.open({ id: data.record.id });
                  },
                },
                {
                  text: app.localize('Delete'),
                  visible: function (data) {
                    return _permissions.delete;
                  },
                  action: function (data) {
                    deleteProperty(data.record.id);
                  },
                },
                {
                  text: app.localize('EditValues'),
                  visible: function (data) {
                    var _inputTypeManager = abp.inputTypeProviders.getInputTypeInstance(data.record.inputType);
                    return _permissions.dynamicPropertyValue_edit && _inputTypeManager.hasValues;
                  },
                  action: function (data) {
                    _manageValuesModal.open({ id: data.record.id });
                  },
                },
              ],
            },
          },
          {
            targets: 2,
            data: 'propertyName',
          },
          {
            targets: 3,
            data: 'displayName',
          },
          {
            targets: 4,
            data: 'inputType',
          },
          {
            targets: 5,
            data: 'permission',
          },
        ],
      });
    }

    $('#CreateNewDynamicProperty').click(function () {
      _createOrEditModal.open();
    });

    $('#GetDynamicPropertiesButton').click(function (e) {
      e.preventDefault();
      loadDynamicProperties();
    });

    function loadDynamicProperties() {
      if (!_initialized) {
        return;
      }
      _dataTable.ajax.reload();
    }

    abp.event.on('app.createOrEditDynamicPropertyModalSaved', function () {
      loadDynamicProperties();
    });

    function deleteProperty(id) {
      abp.message.confirm(
        app.localize('DeleteDynamicPropertyMessage'),
        app.localize('AreYouSure'),
        function (isConfirmed) {
          if (isConfirmed) {
            abp.ui.setBusy();
            _dynamicPropertyAppService
              .delete(id)
              .done(function () {
                loadDynamicProperties();
                abp.notify.success(app.localize('SuccessfullyDeleted'));
              })
              .always(function () {
                abp.ui.clearBusy();
              });
          }
        }
      );
    }

    initializeTable();
  });
})();
