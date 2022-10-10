(function () {
  app.modals.ManageDynamicEntityPropertyModal = function () {
    var _dynamicEntityPropertyAppService = abp.services.app.dynamicEntityProperty;

    var _modalManager;
    var _table;
    var _dataTable;
    var _args;

    this.init = function (modalManager) {
      _modalManager = modalManager;
      _args = _modalManager.getArgs();
      initTable();
      modalManager.getModal().find('.modal-title').text(_args.entityFullName);

      modalManager
        .getModal()
        .find('#CreateNewDynamicEntityProperty')
        .click(function () {
          _createModal.open({ entityFullName: _args.entityFullName });
        });

      abp.event.on('app.createOrEditDynamicEntityPropertiesModalSaved', function () {
        loadDynamicEntityProperties();
      });
    };

    var _createModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/DynamicEntityProperty/CreateModal',
      scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/DynamicEntityProperties/_CreateModal.js',
      modalClass: 'CreateDynamicEntityPropertyModal',
      cssClass: 'scrollable-modal',
    });

    var _permissions = {
      delete: abp.auth.hasPermission('Pages.Administration.DynamicEntityProperties.Delete'),
    };

    function initTable() {
      _table = _modalManager.getModal().find('.ManageDynamicEntityPropertiesTable');
      _dataTable = _table.DataTable({
        paging: false,
        serverSide: false,
        processing: false,
        listAction: {
          ajaxFunction: _dynamicEntityPropertyAppService.getAllPropertiesOfAnEntity,
          inputFilter: function () {
            return {
              entityFullName: _args.entityFullName,
            };
          },
        },
        columnDefs: [
          {
            targets: 0,
            orderable: false,
            data: 'dynamicPropertyName',
          },
          {
            targets: 1,
            data: null,
            orderable: false,
            defaultContent: '',
            visible: _permissions.delete,
            rowAction: {
              element: $('<button/>')
                .addClass('btn btn-danger')
                .text(app.localize('Delete'))
                .click(function () {
                  deleteDynamicEntityProperty($(this).data());
                }),
            },
          },
        ],
      });
    }

    function loadDynamicEntityProperties() {
      if (!_dataTable || !_modalManager.getModal().find('.ManageDynamicEntityPropertiesTable')) {
        debugger;
      }
      _dataTable.ajax.reload();
    }

    function deleteDynamicEntityProperty(data) {
      abp.message.confirm(
        app.localize('DeleteDynamicEntityPropertyMessage', data.entityFullName, data.dynamicPropertyName),
        app.localize('AreYouSure'),
        function (isConfirmed) {
          if (isConfirmed) {
            abp.ui.setBusy();
            _dynamicEntityPropertyAppService
              .delete(data.id)
              .done(function () {
                abp.event.trigger('app.dynamic-entity-property.removed-from-entity');

                loadDynamicEntityProperties();
                abp.notify.success(app.localize('SuccessfullyDeleted'));
              })
              .always(function () {
                abp.ui.clearBusy();
              });
          }
        }
      );
    }
  };
})();
