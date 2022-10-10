(function () {
  $(function () {
    var _table = $('#WebHookSendAttemptTable');
    var _webhookSubscriptionService = abp.services.app.webhookSubscription;
    var _webhookSendAttemptService = abp.services.app.webhookSendAttempt;

    var _permissions = {
      create: abp.auth.hasPermission('Pages.Administration.WebhookSubscription.Create'),
      edit: abp.auth.hasPermission('Pages.Administration.WebhookSubscription.Edit'),
      changeActivity: abp.auth.hasPermission('Pages.Administration.WebhookSubscription.ChangeActivity'),
      detail: abp.auth.hasPermission('Pages.Administration.WebhookSubscription.Detail'),
      list: abp.auth.hasPermission('Pages.Administration.Webhook.ListSendAttempts'),
      resend: abp.auth.hasPermission('Pages.Administration.Webhook.ResendWebhook'),
    };

    var _createOrEditModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/WebhookSubscription/EditModal',
      scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/WebhookSubscriptions/_CreateOrEditModal.js',
      modalClass: 'CreateOrEditWebhookSubscriptionModal',
      cssClass: 'scrollable-modal',
    });

    var dataTable = _table.DataTable({
      paging: true,
      serverSide: true,
      processing: false,
      listAction: {
        ajaxFunction: _webhookSendAttemptService.getAllSendAttempts,
        inputFilter: function () {
          return {
            subscriptionId: subscriptionData.Id,
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
            text: '<i class="fa fa-cog"></i><span class="caret"></span>',
            items: [
              {
                text: app.localize('Resend'),
                visible: function (data) {
                  return _permissions.resend;
                },
                action: function (data) {
                  resendWebhook(data.record.id);
                },
              },
              {
                text: app.localize('ViewWebhookEvent'),
                action: function (data) {
                  window.location = '/App/WebhookSubscription/WebhookEventDetail/' + data.record.webhookEventId;
                },
              },
            ],
          },
        },
        {
          targets: 2,
          orderable: false,
          data: 'webhookName',
        },
        {
          targets: 3,
          orderable: false,
          data: 'webhookEventId',
        },
        {
          targets: 4,
          orderable: false,
          data: 'creationTime',
          render: function (creationTime) {
            return moment(creationTime);
          },
        },
        {
          targets: 5,
          orderable: false,
          data: 'responseStatusCode',
        },
        {
          targets: 6,
          orderable: false,
          data: 'response',
          render: function (response) {
            return getLengthSafetyDataOrDetailModal(response, 100, app.localize('ShowResponse'));
          },
        },
        {
          targets: 7,
          orderable: false,
          data: 'data',
          render: function (data) {
            return getLengthSafetyDataOrDetailModal(data, 100, app.localize('ShowData'));
          },
        },
      ],
    });

    function tooggleActivity() {
      abp.message.confirm(
        subscriptionData.IsActive
          ? app.localize('DeactivateSubscriptionWarningMessage')
          : app.localize('ActivateSubscriptionWarningMessage'),
        app.localize('AreYouSure'),
        function (isConfirmed) {
          if (isConfirmed) {
            abp.ui.setBusy();
            _webhookSubscriptionService
              .activateWebhookSubscription({
                subscriptionId: subscriptionData.Id,
                isActive: !subscriptionData.IsActive,
              })
              .done(function () {
                window.location.reload();
                abp.notify.success(
                  subscriptionData.IsActive
                    ? app.localize('SuccessfullyDeactivated')
                    : app.localize('SuccessfullyActivated')
                );
              })
              .always(function () {
                abp.ui.clearBusy();
              });
          }
        }
      );
    }

    function resendWebhook(id) {
      abp.message.confirm(
        app.localize('WebhookEventWillBeSendWithSameParameters'),
        app.localize('AreYouSure'),
        function (isConfirmed) {
          if (isConfirmed) {
            abp.ui.setBusy();
            _webhookSendAttemptService
              .resend(id)
              .done(function () {
                abp.notify.success(app.localize('WebhookSendAttemptInQueue'));
              })
              .always(function () {
                abp.ui.clearBusy();
              });
          }
        }
      );
    }

    function renameActivityToggleBtn() {
      $('#activity-toggle-btn').text(subscriptionData.IsActive ? app.localize('Deactivate') : app.localize('Activate'));
    }

    renameActivityToggleBtn();

    $('#activity-toggle-btn').click(function () {
      tooggleActivity();
    });

    $('#subscription-edit-btn').click(function () {
      _createOrEditModal.open({ subscriptionId: subscriptionData.Id });
    });

    $('#ToggleActivity').click(function (e) {
      tooggleActivity();
      //TODO:Change view
    });

    $('#secret-view-btn').click(function (e) {
      $('#secretSpan').removeClass('blur');
      $(this).remove();
    });

    abp.event.on('app.createOrEditWebhookSubscriptionModalSaved', function () {
      window.location.reload();
    });

    $('#refresh-send-attempts-btn').click(function (e) {
      getWebhookSendAttempts();
    });

    function getWebhookSendAttempts() {
      dataTable.ajax.reload();
    }

    function getLengthSafetyDataOrDetailModal(data, maxLength, defaultString) {
      if (typeof data != 'string') {
        return data;
      }

      if (data.length <= maxLength) {
        return data;
      }
      var randomId = getRandomId();
      return `<button class="btn btn-outline-primary btn-sm" onclick="ShowDetailModal('${randomId}')" >${defaultString}</button>
                    <div class="d-none" id= ${randomId}>${data}</div>`;
    }

    function getRandomId() {
      return 'detail-' + parseInt(Math.random() * 10000000) + parseInt(Math.random() * 10000000);
    }
  });
})();

function ShowDetailModal(detailId) {
  var detailText = $('#' + detailId).text();
  var detailModal = $('#SendAttemptDetailModal');
  detailModal.find('.modal-body').text(detailText);
  detailModal.modal('show');
}
