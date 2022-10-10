(function () {
  $(function () {
    var _$usersTable = $('#UsersTable');
    var _userService = abp.services.app.user;
    var _$numberOfFilteredPermission = $('#NumberOfFilteredPermission');
    var _dynamicEntityPropertyManager = new DynamicEntityPropertyManager();

    var _selectedPermissionNames = [];

    var _$permissionFilterModal = app.modals.PermissionTreeModal.create({
      disableCascade: true,
      onSelectionDone: function (filteredPermissions) {
        _selectedPermissionNames = filteredPermissions;
        var filteredPermissionCount = filteredPermissions.length;

        _$numberOfFilteredPermission.text(filteredPermissionCount);
        abp.notify.success(app.localize('XCountPermissionFiltered', filteredPermissionCount));

        getUsers();
      },
    });

    var _permissions = {
      create: abp.auth.hasPermission('Pages.Administration.Users.Create'),
      edit: abp.auth.hasPermission('Pages.Administration.Users.Edit'),
      changePermissions: abp.auth.hasPermission('Pages.Administration.Users.ChangePermissions'),
      impersonation: abp.auth.hasPermission('Pages.Administration.Users.Impersonation'),
      unlock: abp.auth.hasPermission('Pages.Administration.Users.Unlock'),
      delete: abp.auth.hasPermission('Pages.Administration.Users.Delete'),
    };

    var _createOrEditModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/Users/CreateOrEditModal',
      scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Users/_CreateOrEditModal.js',
      modalClass: 'CreateOrEditUserModal',
    });

    var _userPermissionsModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/Users/PermissionsModal',
      scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Users/_PermissionsModal.js',
      modalClass: 'UserPermissionsModal',
    });

    var dataTable = _$usersTable.DataTable({
      paging: true,
      serverSide: true,
      processing: true,
      listAction: {
        ajaxFunction: _userService.getUsers,
        inputFilter: function () {
          return {
            filter: $('#UsersTableFilter').val(),
            permissions: _selectedPermissionNames,
            role: $('#RoleSelectionCombo').val(),
            onlyLockedUsers: $('#UsersTable_OnlyLockedUsers').is(':checked'),
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
                text: app.localize('LoginAsThisUser'),
                visible: function (data) {
                  return _permissions.impersonation && data.record.id !== abp.session.userId;
                },
                action: function (data) {
                  abp.ajax({
                    url: abp.appPath + 'Account/ImpersonateUser',
                    data: JSON.stringify({
                      tenantId: abp.session.tenantId,
                      userId: data.record.id,
                    }),
                  });
                },
              },
              {
                text: app.localize('Edit'),
                visible: function () {
                  return _permissions.edit;
                },
                action: function (data) {
                  _createOrEditModal.open({ id: data.record.id });
                },
              },
              {
                text: app.localize('Permissions'),
                visible: function () {
                  return _permissions.changePermissions;
                },
                action: function (data) {
                  _userPermissionsModal.open({ id: data.record.id });
                },
              },
              {
                text: app.localize('Unlock'),
                visible: function () {
                  return _permissions.unlock;
                },
                action: function (data) {
                  _userService
                    .unlockUser({
                      id: data.record.id,
                    })
                    .done(function () {
                      abp.notify.success(app.localize('UnlockedTheUser', data.record.userName));
                    });
                },
              },
              {
                text: app.localize('DynamicProperties'),
                visible: function () {
                  return _dynamicEntityPropertyManager.canShow(
                    'CCPDemo.Authorization.Users.User'
                  );
                },
                action: function (data) {
                  _dynamicEntityPropertyManager.modal.open({
                    entityFullName: 'CCPDemo.Authorization.Users.User',
                    rowId: data.record.id,
                  });
                },
              },
              {
                text: app.localize('Delete'),
                visible: function () {
                  return _permissions.delete;
                },
                action: function (data) {
                  deleteUser(data.record);
                },
              },
            ],
          },
        },
        {
          targets: 2,
          data: 'userName',
          render: function (userName, type, row, meta) {
            var $container = $('<span/>');
            var profilePicture =
              '/Profile/GetProfilePictureByUser?userId=' + row.id + '&profilePictureId=' + row.profilePictureId;

            if (profilePicture) {
              var $link = $('<a/>').attr('href', profilePicture).attr('target', '_blank');
              var $img = $('<img/>').addClass('img-circle').attr('src', profilePicture);

              $link.append($img);
              $container.append($link);
            }

            $container.append(userName);
            return $container[0].outerHTML;
          },
        },
        {
          targets: 3,
          data: 'name',
        },
        {
          targets: 4,
          data: 'surname',
        },
        {
          targets: 5,
          data: 'roles',
          orderable: false,
          render: function (roles) {
            var roleNames = '';
            for (var j = 0; j < roles.length; j++) {
              if (roleNames.length) {
                roleNames = roleNames + ', ';
              }

              roleNames = roleNames + roles[j].roleName;
            }

            return roleNames;
          },
        },
        {
          targets: 6,
          data: 'emailAddress',
        },
        {
          targets: 7,
          data: 'isEmailConfirmed',
          render: function (isEmailConfirmed) {
            var $span = $('<span/>').addClass('label');
            if (isEmailConfirmed) {
              $span.addClass('badge badge-success').text(app.localize('Yes'));
            } else {
              $span.addClass('badge badge-dark').text(app.localize('No'));
            }
            return $span[0].outerHTML;
          },
        },
        {
          targets: 8,
          data: 'isActive',
          render: function (isActive) {
            var $span = $('<span/>').addClass('label');
            if (isActive) {
              $span.addClass('badge badge-success').text(app.localize('Yes'));
            } else {
              $span.addClass('badge badge-dark').text(app.localize('No'));
            }
            return $span[0].outerHTML;
          },
        },
        {
          targets: 9,
          data: 'creationTime',
          render: function (creationTime) {
            return moment(creationTime).format('L');
          },
        },
      ],
    });

    function getUsers() {
      dataTable.ajax.reload();
    }

    function deleteUser(user) {
      if (user.userName === app.consts.userManagement.defaultAdminUserName) {
        abp.message.warn(app.localize('{0}UserCannotBeDeleted', app.consts.userManagement.defaultAdminUserName));
        return;
      }

      abp.message.confirm(
        app.localize('UserDeleteWarningMessage', user.userName),
        app.localize('AreYouSure'),
        function (isConfirmed) {
          if (isConfirmed) {
            _userService
              .deleteUser({
                id: user.id,
              })
              .done(function () {
                getUsers(true);
                abp.notify.success(app.localize('SuccessfullyDeleted'));
              });
          }
        }
      );
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

    $('#CreateNewUserButton').click(function () {
      _createOrEditModal.open();
    });

    var getSortingFromDatatable = function () {
      if (dataTable.ajax.params().order.length > 0) {
        var columnIndex = dataTable.ajax.params().order[0].column;
        var dir = dataTable.ajax.params().order[0].dir;
        var columnName = dataTable.ajax.params().columns[columnIndex].data;

        return columnName + ' ' + dir;
      } else {
        return '';
      }
    };

    $('#ExportUsersToExcelButton').click(function (e) {
      e.preventDefault();
      _userService
        .getUsersToExcel({
          filter: $('#UsersTableFilter').val(),
          permissions: _selectedPermissionNames,
          role: $('#RoleSelectionCombo').val(),
          onlyLockedUsers: $('#UsersTable_OnlyLockedUsers').is(':checked'),
          sorting: getSortingFromDatatable(),
        })
        .done(function (result) {
          app.downloadTempFile(result);
        });
    });

    $('#GetUsersButton, #RefreshUserListButton').click(function (e) {
      e.preventDefault();
      getUsers();
    });

    $('#UsersTableFilter').on('keydown', function (e) {
      if (e.keyCode !== 13) {
        return;
      }

      e.preventDefault();
      getUsers();
    });

    abp.event.on('app.createOrEditUserModalSaved', function () {
      getUsers();
    });

    $('#UsersTableFilter').focus();

    $('#ImportUsersFromExcelButton')
      .fileupload({
        url: abp.appPath + 'Users/ImportFromExcel',
        dataType: 'json',
        maxFileSize: 1048576 * 100,
        dropZone: $('#UsersTable'),
        done: function (e, response) {
          var jsonResult = response.result;
          if (jsonResult.success) {
            abp.notify.info(app.localize('ImportUsersProcessStart'));
          } else {
            abp.notify.warn(app.localize('ImportUsersUploadFailed'));
          }
        },
      })
      .prop('disabled', !$.support.fileInput)
      .parent()
      .addClass($.support.fileInput ? undefined : 'disabled');

    $('#FilterByPermissionsButton').click(function () {
      _$permissionFilterModal.open({ grantedPermissionNames: _selectedPermissionNames });
    });
  });
})();
