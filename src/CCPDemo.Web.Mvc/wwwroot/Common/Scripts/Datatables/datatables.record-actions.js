/************************************************************************
 * RECORD-ACTIONS extension for datatables                               *
 *************************************************************************/
(function ($) {
  if (!$.fn.dataTableExt) {
    return;
  }

  var _createDropdownItem = function (record, fieldItem) {
    var $li = $('<li/>');
    var $a = $('<a/>').addClass('dropdown-item').attr('href', '#');

    $a.html(typeof fieldItem.text === 'function' ? fieldItem.text(record) : fieldItem.text);

    if (fieldItem.action) {
      $a.click(function (e) {
        e.preventDefault();

        if (!$(this).closest('li').hasClass('disabled')) {
          fieldItem.action({
            record: record,
          });
        }
      });
    }

    if (fieldItem.iconStyle) {
      $a.prepend($('<i class="' + fieldItem.iconStyle + '"></i>'));
    }

    $a.appendTo($li);
    return $li;
  };

  var _createButtonDropdown = function (record, field) {
    var $container = $('<div/>').addClass('btn-group');

    var $dropdownButton = $('<button/>')
      .html(typeof field.text === 'function' ? field.text(record) : field.text)
      .addClass('btn btn-primary btn-sm dropdown-toggle')
      .attr('data-bs-toggle', 'dropdown')
      .attr('aria-haspopup', 'true')
      .attr('aria-expanded', 'false');

    if (field.cssClass) {
      $dropdownButton.addClass(field.cssClass);
    }

    var $dropdownItemsContainer = $('<ul/>').addClass('dropdown-menu');

    if (app.isRTL()) {
      $dropdownItemsContainer.addClass('dropdown-menu-right');
    }

    for (var i = 0; i < field.items.length; i++) {
      var fieldItem = field.items[i];

      if (fieldItem.visible && !fieldItem.visible({ record: record })) {
        continue;
      }

      var $dropdownItem = _createDropdownItem(record, fieldItem);

      if (fieldItem.enabled && !fieldItem.enabled({ record: record })) {
        $dropdownItem.addClass('disabled');
      }

      $dropdownItem.appendTo($dropdownItemsContainer);
    }

    if ($dropdownItemsContainer.find('li').length > 0) {
      $dropdownButton.appendTo($container);
      $dropdownItemsContainer.appendTo($container);
    }

    if ($dropdownItemsContainer.children().length === 0) {
      return '';
    }

    return $container;
  };

  var _createSingleButton = function (record, field) {
    $(field.element).data(record);

    if (field.visible === undefined) {
      return field.element;
    }

    var isVisibilityFunction = typeof field.visible === 'function';
    if (isVisibilityFunction) {
      if (field.visible({ record: record })) {
        return field.element;
      }
    } else {
      if (field.visible) {
        return field.element;
      }
    }

    return '';
  };

  var _createRowAction = function (record, field, tableInstance) {
    if (field.items && field.items.length > 1) {
      return _createButtonDropdown(record, field, tableInstance);
    } else if (field.element) {
      var $singleActionButton = _createSingleButton(record, field);
      if ($singleActionButton != '') {
        return $singleActionButton.clone(true);
      }
    }

    return '';
  };

  var hideColumnWithoutRedraw = function (tableInstance, colIndex) {
    tableInstance.fnSetColumnVis(colIndex, false, false);
  };

  var hideEmptyColumn = function (cellContent, tableInstance, colIndex) {
    if (cellContent == '') {
      hideColumnWithoutRedraw(tableInstance, colIndex);
    }
  };

  var renderRowActions = function (tableInstance, nRow, aData, iDisplayIndex, iDisplayIndexFull) {
    var columns;
    if (tableInstance.aoColumns) {
      columns = tableInstance.aoColumns;
    } else {
        // Get visible columns, because cells created for visible columns.
        columns = tableInstance.fnSettings().aoColumns.filter(t => t.bVisible);
    }

    if (!columns) {
      return;
    }

    var cells = $(nRow).children('td');

    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      var column = columns[colIndex];
      if (column.rowAction) {
        var $actionContainer = _createRowAction(aData, column.rowAction, tableInstance);
        hideEmptyColumn($actionContainer, tableInstance, colIndex);

        var $actionButton = $(cells[colIndex]).find('.action-button');
        if ($actionButton.length === 0) {
          $(cells[colIndex]).empty();
          $(cells[colIndex]).append($actionContainer);
        }
      }
    }
  };

  var _existingApiRenderRowActionsFunction = $.fn.dataTableExt.oApi.renderRowActions;
  $.fn.dataTableExt.oApi.renderRowActions = function (tableInstance, nRow, aData, iDisplayIndex, iDisplayIndexFull) {
    if (_existingApiRenderRowActionsFunction) {
      _existingApiRenderRowActionsFunction(tableInstance, nRow, aData, iDisplayIndex, iDisplayIndexFull);
    }

    renderRowActions(tableInstance, nRow, aData, iDisplayIndex, iDisplayIndexFull);
  };

  if (!$.fn.dataTable) {
    return;
  }

  var _existingDefaultFnRowCallback = $.fn.dataTable.defaults.fnRowCallback;
  $.extend(true, $.fn.dataTable.defaults, {
    fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      if (_existingDefaultFnRowCallback) {
        _existingDefaultFnRowCallback(this, nRow, aData, iDisplayIndex, iDisplayIndexFull);
      }

      renderRowActions(this, nRow, aData, iDisplayIndex, iDisplayIndexFull);
    },
  });
})(jQuery);
