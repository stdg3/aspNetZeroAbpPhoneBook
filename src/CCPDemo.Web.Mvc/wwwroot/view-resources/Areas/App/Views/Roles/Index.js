(function () {
  $(function () {
    var _$rolesTable = $('#RolesTable');
    var _roleService = abp.services.app.role;
    var _entityTypeFullName = 'CCPDemo.Authorization.Roles.Role';

    var _$numberOfFilteredPermission = $('#NumberOfFilteredPermission');

    var _selectedPermissionNames = [];

    var _$permissionFilterModal = app.modals.PermissionTreeModal.create({
      onSelectionDone: function (filteredPermissions) {
        _selectedPermissionNames = filteredPermissions;
        var filteredPermissionCount = filteredPermissions.length;

        _$numberOfFilteredPermission.text(filteredPermissionCount);
        abp.notify.success(app.localize('XCountPermissionFiltered', filteredPermissionCount));

        getRoles();
      },
    });

    var _permissions = {
      create: abp.auth.hasPermission('Pages.Administration.Roles.Create'),
      edit: abp.auth.hasPermission('Pages.Administration.Roles.Edit'),
      delete: abp.auth.hasPermission('Pages.Administration.Roles.Delete'),
    };

    var _createOrEditModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/Roles/CreateOrEditModal',
      scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Roles/_CreateOrEditModal.js',
      modalClass: 'CreateOrEditRoleModal',
      cssClass: 'scrollable-modal',
    });

    var _entityTypeHistoryModal = app.modals.EntityTypeHistoryModal.create();

    function entityHistoryIsEnabled() {
      return (
        abp.custom.EntityHistory &&
        abp.custom.EntityHistory.IsEnabled &&
        _.filter(abp.custom.EntityHistory.EnabledEntities, function (entityType) {
          return entityType === _entityTypeFullName;
        }).length === 1
      );
    }

    var dataTable = _$rolesTable.DataTable({
      paging: false,
      serverSide: false,
      processing: false,
      drawCallback: function (settings) {
        $('[data-toggle=tooltip]').tooltip();
      },
      listAction: {
        ajaxFunction: _roleService.getRoles,
        inputFilter: function () {
          return {
            permissions: _selectedPermissionNames,
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
                text: app.localize('Edit'),
                visible: function () {
                  return _permissions.edit;
                },
                action: function (data) {
                  _createOrEditModal.open({ id: data.record.id });
                },
              },
              {
                text: app.localize('Delete'),
                visible: function (data) {
                  return !data.record.isStatic && _permissions.delete;
                },
                action: function (data) {
                  deleteRole(data.record);
                },
              },
              {
                text: app.localize('History'),
                visible: function () {
                  return entityHistoryIsEnabled();
                },
                action: function (data) {
                  _entityTypeHistoryModal.open({
                    entityTypeFullName: _entityTypeFullName,
                    entityId: data.record.id,
                    entityTypeDescription: data.record.displayName,
                  });
                },
              },
            ],
          },
        },
        {
          targets: 2,
          data: 'displayName',
          render: function (displayName, type, row, meta) {
            var $span = $('<span/>');
            $span.append(displayName + ' &nbsp;');

            if (row.isStatic) {
              $span.append(
                $('<span/>')
                  .addClass('badge badge-primary')
                  .attr('data-toggle', 'tooltip')
                  .attr('title', app.localize('StaticRole_Tooltip'))
                  .attr('data-placement', 'top')
                  .text(app.localize('Static'))
                  .css('margin-right', '5px')
              );
            }

            if (row.isDefault) {
              $span.append(
                $('<span/>')
                  .addClass('badge badge-dark')
                  .attr('data-toggle', 'tooltip')
                  .attr('title', app.localize('DefaultRole_Description'))
                  .attr('data-placement', 'top')
                  .text(app.localize('Default'))
                  .css('margin-right', '5px')
              );
            }

            return $span[0].outerHTML;
          },
        },
        {
          targets: 3,
          data: 'creationTime',
          render: function (creationTime) {
            return moment(creationTime).format('L');
          },
        },
      ],
    });

    function deleteRole(role) {
      abp.message.confirm(
        app.localize('RoleDeleteWarningMessage', role.displayName),
        app.localize('AreYouSure'),
        function (isConfirmed) {
          if (isConfirmed) {
            _roleService
              .deleteRole({
                id: role.id,
              })
              .done(function () {
                getRoles();
                abp.notify.success(app.localize('SuccessfullyDeleted'));
              });
          }
        }
      );
    }

    $('#CreateNewRoleButton').click(function () {
      _createOrEditModal.open();
    });

    $('#RefreshRolesButton').click(function (e) {
      e.preventDefault();
      getRoles();
    });

    $('#FilterByPermissionsButton').click(function () {
      _$permissionFilterModal.open({ grantedPermissionNames: _selectedPermissionNames });
    });

    function getRoles() {
      dataTable.ajax.reload();
    }

    abp.event.on('app.createOrEditRoleModalSaved', function () {
      getRoles();
    });
  });
})();
