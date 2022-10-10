(function () {
  $(function () {
    var _$editionsTable = $('#EditionsTable');
    var _editionService = abp.services.app.edition;

    var _permissions = {
      create: abp.auth.hasPermission('Pages.Editions.Create'),
      edit: abp.auth.hasPermission('Pages.Editions.Edit'),
      delete: abp.auth.hasPermission('Pages.Editions.Delete'),
      moveTenantsToAnotherEdition: abp.auth.hasPermission('Pages.Editions.MoveTenantsToAnotherEdition'),
    };

    var _createModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/Editions/CreateModal',
      scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Editions/_CreateModal.js',
      modalClass: 'CreateEditionModal',
    });

    var _editModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/Editions/EditModal',
      scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Editions/_EditModal.js',
      modalClass: 'EditEditionModal',
    });

    var _moveTenantsToAnotherEditionModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/Editions/MoveTenantsToAnotherEdition',
      scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Editions/_MoveTenantsToAnotherEditionModal.js',
      modalClass: 'MoveTenantsToAnotherEditionModal',
    });

    function deleteEdition(edition) {
      abp.message.confirm(
        app.localize('EditionDeleteWarningMessage', edition.displayName),
        app.localize('AreYouSure'),
        function (isConfirmed) {
          if (isConfirmed) {
            _editionService
              .deleteEdition({
                id: edition.id,
              })
              .done(function () {
                getEditions();
                abp.notify.success(app.localize('SuccessfullyDeleted'));
              });
          }
        }
      );
    }

    $('#CreateNewEditionButton').click(function () {
      _createModal.open();
    });

    abp.event.on('app.createOrEditEditionModalSaved', function () {
      getEditions();
    });

    var dataTable = _$editionsTable.DataTable({
      paging: false,
      listAction: {
        ajaxFunction: _editionService.getEditions,
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
                visible: function () {
                  return _permissions.edit;
                },
                action: function (data) {
                  _editModal.open({ id: data.record.id });
                },
              },
              {
                text: app.localize('Delete'),
                visible: function () {
                  return _permissions.delete;
                },
                action: function (data) {
                  deleteEdition(data.record);
                },
              },
              {
                text: app.localize('MoveTenantsToAnotherEdition'),
                visible: function () {
                  return _permissions.moveTenantsToAnotherEdition;
                },
                action: function (data) {
                  _moveTenantsToAnotherEditionModal.open({ id: data.record.id });
                },
              },
            ],
          },
        },
        {
          targets: 2,
          data: 'displayName',
        },
        {
          targets: 3,
          data: 'price',
          render: function (displayName, type, row, meta) {
            if (row.dailyPrice || row.weeklyPrice || row.monthlyPrice || row.annualPrice) {
              var currencySign = app.session.application.currencySign;
              return (
                currencySign +
                row.dailyPrice +
                ' ' +
                app.localize('Daily') +
                ' / ' +
                currencySign +
                row.weeklyPrice +
                ' ' +
                app.localize('Weekly') +
                ' / ' +
                currencySign +
                row.monthlyPrice +
                ' ' +
                app.localize('Monthly') +
                ' / ' +
                currencySign +
                row.annualPrice +
                ' ' +
                app.localize('Annual')
              );
            }
            return app.localize('Free');
          },
        },
        {
          targets: 4,
          data: 'trialDayCount',
          render: function (trialDayCount) {
            if (trialDayCount > 0) {
              return app.localize('Yes') + ', ' + trialDayCount + ' ' + app.localize('Days');
            }

            return app.localize('No');
          },
        },
        {
          targets: 5,
          data: 'waitingDayAfterExpire',
        },
        {
          targets: 6,
          data: 'expiringEditionDisplayName',
        },
      ],
    });

    function getEditions() {
      dataTable.ajax.reload();
    }
  });
})();
