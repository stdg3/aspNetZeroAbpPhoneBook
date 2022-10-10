$(function () {
  var _applicationPrefix = 'Mvc';
  var _dashboardCustomizationService = abp.services.app.dashboardCustomization;

  var _addWidgetModal = new app.ModalManager({
    viewUrl: abp.appPath + 'App/' + $('#DashboardName').val() + '/AddWidgetModal',
    scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/CustomizableDashboard/_AddWidgetModal.js',
    modalClass: 'AddWidgetModal',
  });

  var toggleToolbarButtonsVisibility = function (active) {
    if (active) {
      $('.deleteWidgetButton').removeClass('d-none');
      $('.div-dashboard-customization').removeClass('d-none');
    } else {
      $('.deleteWidgetButton').addClass('d-none');
      $('.div-dashboard-customization').addClass('d-none');
    }
  };

  var enableGrid = function () {
    toggleToolbarButtonsVisibility(true);
    $('.grid-stack').each(function () {
      var grid = this.gridstack;
      if (grid) {
        grid.enable();
      }
    });
  };

  var disableGrid = function () {
    toggleToolbarButtonsVisibility(false);
    $('.grid-stack').each(function () {
      var grid = this.gridstack;
      if (grid) {
        grid.disable();
      }
    });
  };

  var refreshPage = function () {
    location.reload();
  };

  var getCurrentPageId = function () {
    return $('#PagesDiv').find('.active').find('input[name="PageId"]').val();
  };

  var getCurrentPageName = function () {
    return $('#PagesDiv').find('.active').find('input[name="PageName"]').val();
  };

  var savePageData = function () {
    abp.ui.setBusy($('body'));

    var pageContent = [];
    var pages = $('#PagesDiv').find('.page');

    for (var j = 0; j < pages.length; j++) {
      var page = pages[j];
      var pageId = $(page).find('input[name="PageId"]').val();
      var pageName = $(page).find('input[name="PageName"]').val();
      var widgetStackItems = $(page).find('.grid-stack-item');
      var widgets = [];

      for (var i = 0; i < widgetStackItems.length; i++) {
        var widget = {};
        widget.widgetId = $(widgetStackItems[i]).attr('data-widget-id');
        widget.height = $(widgetStackItems[i]).attr('gs-h');
        widget.width = $(widgetStackItems[i]).attr('gs-w');
        widget.positionX = $(widgetStackItems[i]).attr('gs-x');
        widget.positionY = $(widgetStackItems[i]).attr('gs-y');
        widgets[i] = widget;
      }
      pageContent.push({
        id: pageId,
        name: pageName,
        widgets: widgets,
      });
    }

    var filters = [];

    var filterDiv = $('#FiltersDiv');
    if (filterDiv) {
      var filtersStackItems = $(filterDiv).find('.grid-stack-item');

      for (var i = 0; i < filtersStackItems.length; i++) {
        var filter = {};
        filter.widgetFilterId = $(filtersStackItems[i]).attr('data-filter-id');
        filter.height = $(filtersStackItems[i]).attr('data-gs-height');
        filter.width = $(filtersStackItems[i]).attr('data-gs-width');
        filter.positionX = $(filtersStackItems[i]).attr('data-gs-x');
        filter.positionY = $(filtersStackItems[i]).attr('data-gs-y');
        filters[i] = filter;
      }
    }

    _dashboardCustomizationService
      .savePage({
        dashboardName: $('#DashboardName').val(),
        pages: pageContent,
        widgetFilters: filters,
        application: _applicationPrefix,
      })
      .done(function (result) {
        abp.notify.success(app.localize('Saved'));
        $('#EditableCheckbox').prop('checked', false).trigger('change');
      })
      .always(function () {
        abp.ui.clearBusy($('body'));
      });
  };

  $('#AddWidgetButton').click(function () {
    _addWidgetModal.open({
      dashboardName: $('#DashboardName').val(),
      pageId: getCurrentPageId(),
    });
  });

  abp.event.on('app.addWidgetModalSaved', function () {
    refreshPage();
  });

  $('#DeletePageButton').click(function () {
    var pageCount = $('#dashboardPageCount').val();
    var message =
      pageCount > 1
        ? app.localize('PageDeleteWarningMessage', getCurrentPageName())
        : app.localize('BackToDefaultPageWarningMessage', getCurrentPageName());

    abp.message.confirm(message, app.localize('AreYouSure'), function (isConfirmed) {
      if (isConfirmed) {
        _dashboardCustomizationService
          .deletePage({
            dashboardName: $('#DashboardName').val(),
            id: getCurrentPageId(),
            application: _applicationPrefix,
          })
          .done(function (result) {
            refreshPage();
          });
      }
    });
  });

  $('#RenamePageSaveButton').on('click', function () {
    let newName = $('#RenamePageNameInput').val();
    newName = newName.trim();
    if (newName === '') {
      abp.notify.error(app.localize('PageNameCanNotBeEmpty'));
      return;
    }

    _dashboardCustomizationService
      .renamePage({
        dashboardName: $('#DashboardName').val(),
        id: getCurrentPageId(),
        name: newName,
        application: _applicationPrefix,
      })
      .done(function (result) {
        abp.notify.success(app.localize('Renamed'));
        refreshPage();
      });
  });

  $('#AddPageSaveButton').on('click', function () {
    let newName = $('#PageNameInput').val();
    newName = newName.trim();
    if (newName.trim() === '') {
      abp.notify.error(app.localize('PageNameCanNotBeEmpty'));
      return;
    }

    _dashboardCustomizationService
      .addNewPage({
        dashboardName: $('#DashboardName').val(),
        name: newName,
        application: _applicationPrefix,
      })
      .done(function (result) {
        abp.notify.success(app.localize('Saved'));
        refreshPage();
      });
  });

  $('#RenamePageDropdownMenuButton').on('click', function () {
    $('#RenamePageNameInput').attr('placeholder', getCurrentPageName());
    $('#RenamePageNameInput').val('');
  });

  $('#AddPageButtonDropdownMenuButton').on('click', function () {
    $('#PageNameInput').val('');
  });

  $('#EditableCheckbox').change(function () {
    if ($(this).is(':checked')) {
      enableGrid();
      $(this).closest('.switch').addClass('switch-primary');
    } else {
      disableGrid();
      $(this).closest('.switch').removeClass('switch-primary');
    }
  });

  $(document).on('click', '.deleteWidgetButton', function () {
    var stackItem = $(this).closest('.grid-stack-item');
    abp.message.confirm(
      app.localize('WidgetDeleteWarningMessage', stackItem.attr('data-widget-name'), getCurrentPageName()),
      app.localize('AreYouSure'),
      function (isConfirmed) {
        if (isConfirmed) {
          stackItem.remove();
        }
      }
    );
  });

  $('#savePageButton').on('click', function () {
    savePageData();
  });

  function initialize() {
    GridStack.initAll();

    // $('.grid-stack-item-content').mCustomScrollbar({
    //   theme: 'minimal-dark',
    // });

    $('.grid-stack').each(function () {
      var grid = this.gridstack;
      if (grid) {
        grid.cellHeight(35);
        grid.disable();
      }
    });
  }

  initialize();
});
