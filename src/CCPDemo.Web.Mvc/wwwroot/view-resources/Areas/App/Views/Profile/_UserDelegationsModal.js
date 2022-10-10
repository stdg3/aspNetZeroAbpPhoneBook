(function ($) {
  app.modals.UserDelegationsModal = function () {
    var _modalManager;
    var _$delegatedUsersTable = $('#DelegatedUsersTable');
    var _userDelegationService = abp.services.app.userDelegation;

    this.init = function (modalManager) {
      _modalManager = modalManager;
    };

    var _createNewUserDelegationModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/Profile/CreateNewUserDelegationModal',
      scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Profile/_CreateNewUserDelegationModal.js',
      modalClass: 'CreateNewUserDelegationModal',
    });

    $('#DelegateNewUserButton').click(function () {
      _createNewUserDelegationModal.open({}, function () {
        getDelegatedUsers();
      });
    });

    var dataTable = _$delegatedUsersTable.DataTable({
      paging: true,
      serverSide: true,
      processing: true,
      listAction: {
        ajaxFunction: _userDelegationService.getDelegatedUsers,
      },
      columnDefs: [
        {
          targets: 0,
          data: 'username',
          orderable: false,
          render: function (userName, type, row, meta) {
            return $('<div/>').append($('<span/>').text(userName))[0].outerHTML;
          },
        },
        {
          targets: 1,
          data: 'startTime',
          orderable: false,
          render: function (startTime, type, row, meta) {
            return moment(startTime).format('YYYY-MM-DD HH:mm:ss');
          },
        },
        {
          targets: 2,
          data: 'endTime',
          orderable: false,
          render: function (endTime, type, row, meta) {
            return moment(endTime).format('YYYY-MM-DD HH:mm:ss');
          },
        },
        {
          targets: 3,
          data: null,
          orderable: false,
          defaultContent: '',
          rowAction: {
            element: $('<button/>')
              .addClass('btn btn-icon btn-bg-light btn-active-color-danger btn-sm')
              .attr('title', app.localize('Delete'))
              .append($('<i/>').addClass('la la-trash'))
              .click(function () {
                deleteUserDelegation($(this).data());
              }),
          },
        },
      ],
    });

    function deleteUserDelegation(userDelegation) {
      abp.message.confirm(
        app.localize('UserDelegationDeleteWarningMessage', userDelegation.username),
        app.localize('AreYouSure'),
        function (isConfirmed) {
          if (isConfirmed) {
            _userDelegationService
              .removeDelegation({
                id: userDelegation.id,
              })
              .done(function () {
                getDelegatedUsers();
                abp.notify.success(app.localize('SuccessfullyDeleted'));
              });
          }
        }
      );
    }

    function getDelegatedUsers() {
      dataTable.ajax.reload();
    }
  };
})(jQuery);
