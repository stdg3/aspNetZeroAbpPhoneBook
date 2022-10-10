var ManageDynamicEntityPropertyValueBase = (function ($) {
  return function () {
    var _dynamicEntityPropertyValueAppService = abp.services.app.dynamicEntityPropertyValue;
    var dataAndInputTypes = [];
    var _args;
    var _permissions = {
      delete: abp.auth.hasPermission('Pages.Administration.DynamicEntityPropertyValue.Delete'),
    };

    function initialize(args) {
      abp.ui.setBusy();
      _args = args;
      dataAndInputTypes = [];
      _dynamicEntityPropertyValueAppService
        .getAllDynamicEntityPropertyValues({
          entityFullName: args.entityFullName,
          entityId: args.entityId,
        })
        .done(function (data) {
          var body = $(args.bodyElement);
          if (!data || !data.items || data.items.length == 0) {
            var row = $('<tr></tr>');

            var td = $("<td class='text-center' colspan='3'></td>");
            td.text(app.localize('ThereAreNoDynamicPropertiesMessage'));

            row.append(td);
            body.append(row);
            return;
          }

          for (var i = 0; i < data.items.length; i++) {
            var item = data.items[i];
            var inputTypeManager = abp.inputTypeProviders.getInputTypeInstance({ inputType: item.inputType });

            body.append(getRow(item, inputTypeManager));
            inputTypeManager.afterViewInitialized();

            dataAndInputTypes.push({
              data: item,
              inputTypeManager: inputTypeManager,
            });
          }
        })
        .always(function () {
          abp.ui.clearBusy();
        });
    }

    function getRow(item, inputTypeManager) {
      var view = inputTypeManager.getView(item.selectedValues, item.allValuesInputTypeHas);
      var row = $('<tr></tr>');

      var propertyNameTd = $('<td></td>');
      propertyNameTd.text(item.propertyName);

      var viewTd = $('<td></td>').append(view);
      viewTd.append(view);

      var actionsTd = $('<td></td>');
      if (_permissions.delete) {
        var btnDelete = $('<button class="btn btn-danger"></button>')
          .text(app.localize('Delete'))
          .click(function () {
            deleteAllValues({
              dynamicPropertyName: item.dynamicPropertyName,
              dynamicEntityPropertyId: item.dynamicEntityPropertyId,
            });
          });
        actionsTd.append(btnDelete);
      }

      row.append(propertyNameTd);
      row.append(viewTd);
      row.append(actionsTd);

      return row;
    }

    function deleteAllValues(params) {
      abp.message.confirm(
        app.localize('DeleteDynamicEntityPropertyValueMessage', params.dynamicPropertyName),
        app.localize('AreYouSure'),
        function (isConfirmed) {
          if (isConfirmed) {
            abp.ui.setBusy();
            _dynamicEntityPropertyValueAppService
              .cleanValues({
                dynamicEntityPropertyId: params.dynamicEntityPropertyId,
                entityId: _args.entityId,
              })
              .done(function () {
                abp.notify.success(app.localize('SuccessfullyDeleted'));

                if (typeof _args.onDeleteValues === 'function') {
                  _args.onDeleteValues();
                }
              })
              .always(function () {
                abp.ui.clearBusy();
              });
          }
        }
      );
    }

    function save(onDoneCallback) {
      if (!dataAndInputTypes) {
        return;
      }

      abp.ui.setBusy();

      var newValues = [];
      for (var i = 0; i < dataAndInputTypes.length; i++) {
        newValues.push({
          entityId: _args.entityId,
          dynamicEntityPropertyId: dataAndInputTypes[i].data.dynamicEntityPropertyId,
          values: dataAndInputTypes[i].inputTypeManager.getSelectedValues(),
        });
      }

      _dynamicEntityPropertyValueAppService
        .insertOrUpdateAllValues({ Items: newValues })
        .done(function () {
          abp.notify.success(app.localize('SavedSuccessfully'));
          if (typeof onDoneCallback === 'function') {
            onDoneCallback();
          }
        })
        .always(function () {
          abp.ui.clearBusy();
        });
    }

    return {
      initialize: initialize,
      save: save,
    };
  };
})(jQuery);
