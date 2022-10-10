(function () {
  $(function () {
    var _table = $('#WebhookEventDetailSendAttemptsTable');
    var _webhookSendAttemptService = abp.services.app.webhookSendAttempt;

    var _permissions = {
      resend: abp.auth.hasPermission('Pages.Administration.Webhook.ResendWebhook'),
    };

    var dataTable = _table.DataTable({
      paging: false,
      serverSide: false,
      processing: false,
      listAction: {
        ajaxFunction: _webhookSendAttemptService.getAllSendAttemptsOfWebhookEvent,
        inputFilter: function () {
          return {
            id: webhookEventId,
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
                text: app.localize('GoToSubscription'),
                action: function (data) {
                  window.location = '/App/WebhookSubscription/Detail/ ' + data.record.webhookSubscriptionId;
                },
              },
            ],
          },
        },
        {
          targets: 2,
          orderable: false,
          data: 'webhookSubscriptionId',
        },
        {
          targets: 3,
          orderable: false,
          data: 'webhookUri',
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
      ],
    });

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
      return `<button class="btn btn-outline-primary btn-sm" onclick="ShowResponseDetail('${randomId}')" >${defaultString}</button>
                     <div class="d-none" id= ${randomId}>${data}</div>`;
    }

    function getRandomId() {
      return 'detail-' + parseInt(Math.random() * 10000000) + parseInt(Math.random() * 10000000);
    }

    $('#dataShowMoreBtn').click(function (e) {
      $('#dataDots').remove();
      $('#dataMore').removeClass('d-none');
      $(this).remove();
    });
  });
})();

function ShowResponseDetail(detailId) {
  var detailText = $('#' + detailId).text();
  var detailModal = $('#SendAttemptDetailModal');
  detailModal.find('.modal-body').text(detailText);
  detailModal.modal('show');
}
