(function () {
  $(function () {
    var _$personsTable = $('#PersonsTable');
    var _personsService = abp.services.app.persons;

    var $selectedDate = {
      startDate: null,
      endDate: null,
    };

    $('.date-picker').on('apply.daterangepicker', function (ev, picker) {
      $(this).val(picker.startDate.format('MM/DD/YYYY'));
    });

    $('.startDate')
      .daterangepicker(
        {
          autoUpdateInput: false,
          singleDatePicker: true,
          locale: abp.localization.currentLanguage.name,
          format: 'L',
        },
        (date) => {
          $selectedDate.startDate = date;
        }
      )
      .on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
        $selectedDate.startDate = null;
      });

    $('.endDate')
      .daterangepicker(
        {
          autoUpdateInput: false,
          singleDatePicker: true,
          locale: abp.localization.currentLanguage.name,
          format: 'L',
        },
        (date) => {
          $selectedDate.endDate = date;
        }
      )
      .on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
        $selectedDate.endDate = null;
      });

    var _permissions = {
      create: abp.auth.hasPermission('Pages.Persons.Create'),
      edit: abp.auth.hasPermission('Pages.Persons.Edit'),
      delete: abp.auth.hasPermission('Pages.Persons.Delete'),
    };

    var _createOrEditModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/Persons/CreateOrEditModal',
      scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Persons/_CreateOrEditModal.js',
      modalClass: 'CreateOrEditPersonModal',
    });

    var _viewPersonModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/Persons/ViewpersonModal',
      modalClass: 'ViewPersonModal',
    });

    var getDateFilter = function (element) {
      if ($selectedDate.startDate == null) {
        return null;
      }
      return $selectedDate.startDate.format('YYYY-MM-DDT00:00:00Z');
    };

    var getMaxDateFilter = function (element) {
      if ($selectedDate.endDate == null) {
        return null;
      }
      return $selectedDate.endDate.format('YYYY-MM-DDT23:59:59Z');
    };

    var dataTable = _$personsTable.DataTable({
      paging: true,
      serverSide: true,
      processing: true,
      listAction: {
        ajaxFunction: _personsService.getAll,
        inputFilter: function () {
          return {
            filter: $('#PersonsTableFilter').val(),
            nameFilter: $('#NameFilterId').val(),
            surnameFilter: $('#SurnameFilterId').val(),
            emailAddressFilter: $('#EmailAddressFilterId').val(),
          };
        },
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
          width: 120,
          targets: 1,
          data: null,
          orderable: false,
          autoWidth: false,
          defaultContent: '',
          rowAction: {
            cssClass: 'btn btn-brand dropdown-toggle',
            text: '<i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span>',
            items: [
              {
                text: app.localize('View'),
                iconStyle: 'far fa-eye mr-2',
                action: function (data) {
                  _viewPersonModal.open({ id: data.record.person.id });
                },
              },
              {
                text: app.localize('Edit'),
                iconStyle: 'far fa-edit mr-2',
                visible: function () {
                  return _permissions.edit;
                },
                action: function (data) {
                  _createOrEditModal.open({ id: data.record.person.id });
                },
              },
              {
                text: app.localize('Delete'),
                iconStyle: 'far fa-trash-alt mr-2',
                visible: function () {
                  return _permissions.delete;
                },
                action: function (data) {
                  deletePerson(data.record.person);
                },
              },
            ],
          },
        },
        {
          targets: 2,
          data: 'person.name',
          name: 'name',
        },
        {
          targets: 3,
          data: 'person.surname',
          name: 'surname',
        },
        {
          targets: 4,
          data: 'person.emailAddress',
          name: 'emailAddress',
        },
      ],
    });

    function getPersons() {
      dataTable.ajax.reload();
    }

    function deletePerson(person) {
      abp.message.confirm('', app.localize('AreYouSure'), function (isConfirmed) {
        if (isConfirmed) {
          _personsService
            .delete({
              id: person.id,
            })
            .done(function () {
              getPersons(true);
              abp.notify.success(app.localize('SuccessfullyDeleted'));
            });
        }
      });
    }

    $('#ShowAdvancedFiltersSpan').click(function () {
      $('#ShowAdvancedFiltersSpan').hide();
      $('#HideAdvancedFiltersSpan').show();
      $('#AdvacedAuditFiltersArea').slideDown();
    });

    $('#HideAdvancedFiltersSpan').click(function () {
      $('#HideAdvancedFiltersSpan').hide();
      $('#ShowAdvancedFiltersSpan').show();
      $('#AdvacedAuditFiltersArea').slideUp();
    });

    $('#CreateNewPersonButton').click(function () {
      _createOrEditModal.open();
    });

    $('#ExportToExcelButton').click(function () {
      _personsService
        .getPersonsToExcel({
          filter: $('#PersonsTableFilter').val(),
          nameFilter: $('#NameFilterId').val(),
          surnameFilter: $('#SurnameFilterId').val(),
          emailAddressFilter: $('#EmailAddressFilterId').val(),
        })
        .done(function (result) {
          app.downloadTempFile(result);
        });
    });

    abp.event.on('app.createOrEditPersonModalSaved', function () {
      getPersons();
    });

    $('#GetPersonsButton').click(function (e) {
      e.preventDefault();
      getPersons();
    });

    $(document).keypress(function (e) {
      if (e.which === 13) {
        getPersons();
      }
    });
  });
})();
