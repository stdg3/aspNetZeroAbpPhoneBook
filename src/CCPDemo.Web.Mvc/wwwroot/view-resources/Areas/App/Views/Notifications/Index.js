(function () {
  $(function () {
    var _$notificationsTable = $('#NotificationsTable');
    var _notificationService = abp.services.app.notification;

    var _$targetValueFilterSelectionCombobox = $('#TargetValueFilterSelectionCombobox');

    var _appUserNotificationHelper = new app.UserNotificationHelper();

    var _selectedDateRangeNotification = {
      startDate: moment().startOf('day').subtract(7, 'days'),
      endDate: moment().endOf('day'),
    };

    $(document)
      .find('input.date-range-picker')
      .daterangepicker(
        $.extend(true, app.createDateRangePickerOptions(), _selectedDateRangeNotification),
        function (start, end) {
          _selectedDateRangeNotification.startDate = start.format('YYYY-MM-DDT00:00:00Z');
          _selectedDateRangeNotification.endDate = end.format('YYYY-MM-DDT23:59:59.999Z');

          getNotifications();
        }
      );

    var createNotificationReadButton = function ($td, record) {
      var $span = $('<span/>');
      var $button = $('<button/>')
        .addClass('btn btn-sm btn-icon btn-primary')
        .attr('title', app.localize('SetAsRead'))
        .click(function (e) {
          e.preventDefault();
          setNotificationAsRead(record, function () {
            $button.find('i').removeClass('la-circle-o').addClass('la-check');
            $button.attr('disabled', 'disabled');
            $td.closest('tr').addClass('notification-read');
          });
        })
        .appendTo($span);

      var $buttonDelete = $('<button/>')
        .addClass('btn btn-sm btn-icon btn-danger')
        .attr('title', app.localize('Delete'))
        .click(function () {
          deleteNotification(record);
        })
        .appendTo($span);
      $('<i class="la la-remove" >').appendTo($buttonDelete);

      var $i = $('<i class="la" >').appendTo($button);
      var notificationState = _appUserNotificationHelper.format(record).state;

      if (notificationState === 'READ') {
        $button.attr('disabled', 'disabled');
        $i.addClass('la-check');
      }

      if (notificationState === 'UNREAD') {
        $i.addClass('la-circle-o');
      }

      $td.append($span);
    };

    function getNotificationTextBySeverity(severity) {
      switch (severity) {
        case abp.notifications.severity.SUCCESS:
          return app.localize('Success');
        case abp.notifications.severity.WARN:
          return app.localize('Warning');
        case abp.notifications.severity.ERROR:
          return app.localize('Error');
        case abp.notifications.severity.FATAL:
          return app.localize('Fatal');
        case abp.notifications.severity.INFO:
        default:
          return app.localize('Info');
      }
    }

    var dataTable = _$notificationsTable.DataTable({
      paging: true,
      serverSide: true,
      processing: true,
      listAction: {
        ajaxFunction: _notificationService.getUserNotifications,
        inputFilter: function () {
          return {
            state: _$targetValueFilterSelectionCombobox.val(),
            startDate: _selectedDateRangeNotification.startDate,
            endDate: _selectedDateRangeNotification.endDate,
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
          defaultContent: '',
          width: '100px',
          createdCell: function (td, cellData, rowData, rowIndex, colIndex) {
            createNotificationReadButton($(td), rowData);
          },
        },
        {
          targets: 2,
          data: 'severity',
          render: function (severity, type, row, meta) {
            var icon = app.notification.getUiIconBySeverity(row.notification.severity);
            var iconFontClass = app.notification.getIconFontClassBySeverity(row.notification.severity);
            var $span = $('<span></span>');
            var $icon = $(
              `<i class="${icon} ${iconFontClass} fa-2x" data-toggle="tooltip" data-placement="right" data-container="body" data-original-title="${getNotificationTextBySeverity(
                row.notification.severity
              )}"></i>`
            );
            $span.append($icon);

            return $span[0].outerHTML;
          },
        },
        {
          targets: 3,
          data: 'notification',
          render: function (notification, type, row, meta) {
            var $container;
            var formattedRecord = _appUserNotificationHelper.format(row, false);
            var rowClass = getRowClass(formattedRecord);

            if (formattedRecord.url && formattedRecord.url !== '#') {
              $container = $(
                '<a title="' +
                  formattedRecord.text +
                  '" href="' +
                  formattedRecord.url +
                  '" class="' +
                  rowClass +
                  '">' +
                  abp.utils.truncateStringWithPostfix(formattedRecord.text, 120) +
                  '</a>'
              );
            } else {
              $container = $(
                '<span title="' +
                  formattedRecord.text +
                  '" class="' +
                  rowClass +
                  '">' +
                  abp.utils.truncateStringWithPostfix(formattedRecord.text, 120) +
                  '</span>'
              );
            }

            return $container[0].outerHTML;
          },
        },
        {
          targets: 4,
          data: 'creationTime',
          render: function (creationTime, type, row, meta) {
            var formattedRecord = _appUserNotificationHelper.format(row);
            var rowClass = getRowClass(formattedRecord);
            var $container = $(
              '<span title="' +
                moment(row.notification.creationTime).format('llll') +
                '" class="' +
                rowClass +
                '">' +
                formattedRecord.timeAgo +
                '</span> &nbsp;'
            );
            return $container[0].outerHTML;
          },
        },
      ],
      initComplete: function (settings, json) {
        KTApp.initBootstrapTooltips();
      },
    });

    function deleteNotification(notification) {
      abp.message.confirm(
        app.localize('NotificationDeleteWarningMessage'),
        app.localize('AreYouSure'),
        function (isConfirmed) {
          if (isConfirmed) {
            _notificationService
              .deleteNotification({
                id: notification.id,
              })
              .done(function () {
                getNotifications();
                abp.notify.success(app.localize('SuccessfullyDeleted'));
              });
          }
        }
      );
    }

    function deleteNotifications() {
      abp.message.confirm(
        app.localize('DeleteListedNotificationsWarningMessage'),
        app.localize('AreYouSure'),
        function (isConfirmed) {
          if (isConfirmed) {
            _notificationService
              .deleteAllUserNotifications({
                state: _$targetValueFilterSelectionCombobox.val(),
                startDate: _selectedDateRangeNotification.startDate,
                endDate: _selectedDateRangeNotification.endDate,
              })
              .done(function () {
                getNotifications();
                abp.notify.success(app.localize('SuccessfullyDeleted'));
              });
          }
        }
      );
    }

    function getRowClass(formattedRecord) {
      return formattedRecord.state === 'READ' ? 'notification-read' : '';
    }

    function getNotifications() {
      dataTable.ajax.reload();
    }

    function setNotificationAsRead(userNotification, callback) {
      _appUserNotificationHelper.setAsRead(userNotification.id, function () {
        if (callback) {
          callback();
        }
      });
    }

    function setAllNotificationsAsRead() {
      _appUserNotificationHelper.setAllAsRead(function () {
        getNotifications();
      });
    }

    function openNotificationSettingsModal() {
      _appUserNotificationHelper.openSettingsModal();
    }

    _$targetValueFilterSelectionCombobox.change(function () {
      getNotifications();
    });

    $('#RefreshNotificationTableButton').click(function (e) {
      e.preventDefault();
      getNotifications();
    });

    $('#btnOpenNotificationSettingsModal').click(function (e) {
      openNotificationSettingsModal();
    });

    $('#btnSetAllNotificationsAsRead').click(function (e) {
      e.preventDefault();
      setAllNotificationsAsRead();
    });

    $('#DeleteAllNotificationsButton').click(function (e) {
      e.preventDefault();
      deleteNotifications();
    });
  });
})();
