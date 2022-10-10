(function () {
  app.modals.ManageDynamicPropertyValueModal = function () {
    var _modalManager;
    var _table = $('#DynamicPropertyValuesTable');
    var _dynamicPropertyAppService = abp.services.app.dynamicProperty;
    var _dynamicPropertyValueAppService = abp.services.app.dynamicPropertyValue;
    var _inputTypeManager;
    var dataTable;
    var initialized = false;
    var _permissions = {
      edit: abp.auth.hasPermission('Pages.Administration.DynamicPropertyValue.Edit'),
      delete: abp.auth.hasPermission('Pages.Administration.DynamicPropertyValue.Delete'),
    };

    function loadValuesDataTable() {
      dataTable = _table.DataTable({
        paging: false,
        serverSide: true,
        processing: false,
        listAction: {
          ajaxFunction: _dynamicPropertyValueAppService.getAllValuesOfDynamicProperty,
          inputFilter: function () {
            return {
              id: _modalManager.getModal().find('input[name=dynamicPropertyId]').val(),
            };
          },
        },
        columnDefs: [
          {
            targets: 0,
            orderable: false,
            data: 'value',
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
                .text(app.localize('Edit'))
                .click(function () {
                  createOrEditValue($(this).data().id, $(this).data().value);
                }),
            },
          },
          {
            targets: 2,
            data: null,
            orderable: false,
            defaultContent: '',
            visible: _permissions.delete,
            rowAction: {
              element: $('<button/>')
                .addClass('btn btn-danger')
                .text(app.localize('Delete'))
                .click(function () {
                  deleteValue($(this).data().id);
                }),
            },
          },
        ],
      });
    }

    function deleteValue(id) {
      abp.message.confirm(
        app.localize('DeleteDynamicPropertyValueMessage'),
        app.localize('AreYouSure'),
        function (isConfirmed) {
          if (isConfirmed) {
            abp.ui.setBusy();
            _dynamicPropertyValueAppService
              .delete(id)
              .done(function () {
                reloadValues();
                abp.notify.success(app.localize('SuccessfullyDeleted'));
              })
              .always(function () {
                abp.ui.clearBusy();
              });
          }
        }
      );
    }

    $('#add-new-dynamic-property-value').click(function () {
      createOrEditValue();
    });

    abp.event.on('app.createOrDynamicEditPropertyValueModalSaved', function () {
      reloadValues();
    });

    $('#refresh-dynamic-property-values-btn').click(function (e) {
      reloadValues();
    });

    function reloadValues() {
      if (initialized && dataTable) {
        dataTable.ajax.reload();
      }
    }

    function manageValueArea() {
      if (!_inputTypeManager) {
        abp.notify.error('Unknown input type');
        return;
      }

      if (typeof _inputTypeManager.hasValues !== 'boolean') {
        abp.notify.error(`Input type manager ${_inputTypeManager} must have "hasValues" field typed boolean`);
        return;
      }

      if (_inputTypeManager.hasValues) {
        $('#portlet-dynamic-property-values').removeClass('d-none');
        loadValuesDataTable();
      } else {
        $('#portlet-dynamic-property-values').hide();
      }

      initialized = true;
    }

    this.init = function (modalManager) {
      _modalManager = modalManager;
      initialize();
    };

    function initialize() {
      var inputType = _modalManager.getModal().find('input[name=inputType]').val();
      _dynamicPropertyAppService.findAllowedInputType(inputType).done(function (inputType) {
        _inputTypeManager = abp.inputTypeProviders.getInputTypeInstance({ inputType: inputType });
        manageValueArea();
      });
    }

    function createOrEditValue(id, value) {
      if (id) {
        _modalManager.getModal().find('input[name=id]').val(id);
      } else {
        _modalManager.getModal().find('input[name=id]').val(0);
      }

      _modalManager.getModal().find('input[name=dynamicPropertyValue]').val(value);
      _modalManager.getModal().find('#edit-values-area').show('fast');
    }

    $('#save-value').click(function () {
      var dynamicProperty = {
        id: _modalManager.getModal().find('input[name=id]').val(),
        dynamicPropertyId: _modalManager.getModal().find('input[name=dynamicPropertyId]').val(),
        value: _modalManager.getModal().find('input[name=dynamicPropertyValue]').val(),
      };

      _modalManager.setBusy(true);

      if (dynamicProperty.id && dynamicProperty.id > 0) {
        _dynamicPropertyValueAppService
          .update(dynamicProperty)
          .done(function () {
            abp.notify.info(app.localize('SavedSuccessfully'));
            reloadValues();
          })
          .always(function () {
            _modalManager.getModal().find('#edit-values-area').hide('fast');
            _modalManager.setBusy(false);
          });
      } else {
        _dynamicPropertyValueAppService
          .add(dynamicProperty)
          .done(function () {
            abp.notify.info(app.localize('SavedSuccessfully'));
            reloadValues();
          })
          .always(function () {
            _modalManager.getModal().find('#edit-values-area').hide('fast');
            _modalManager.setBusy(false);
          });
      }
    });
  };
})();
