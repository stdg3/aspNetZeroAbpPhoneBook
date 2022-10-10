(function () {
  $(function () {
    var _table = $('#SubscriptionTable');
    var _webhookSubscriptionService = abp.services.app.webhookSubscription;

    var _permissions = {
      create: abp.auth.hasPermission('Pages.Administration.WebhookSubscription.Create'),
      edit: abp.auth.hasPermission('Pages.Administration.WebhookSubscription.Edit'),
      changeActivity: abp.auth.hasPermission('Pages.Administration.WebhookSubscription.ChangeActivity'),
      detail: abp.auth.hasPermission('Pages.Administration.WebhookSubscription.Detail'),
    };

    var _createOrEditModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/WebhookSubscription/CreateModal',
      scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/WebhookSubscriptions/_CreateOrEditModal.js',
      modalClass: 'CreateOrEditWebhookSubscriptionModal',
      cssClass: 'scrollable-modal',
    });

    var dataTable = _table.DataTable({
      paging: false,
      serverSide: false,
      processing: false,
      listAction: {
        ajaxFunction: _webhookSubscriptionService.getAllSubscriptions,
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
          visible: _permissions.detail,
          rowAction: {
            element: $('<button/>')
              .addClass('btn btn-sm btn-primary')
              .text(app.localize('Details'))
              .click(function () {
                goToDetail($(this).data().id);
              }),
          },
        },
        {
          targets: 2,
          data: 'webhookUri',
        },
        {
          targets: 3,
          data: 'webhooks',
          render: function (webhooks) {
            var result = '';
            if (webhooks && webhooks.length > 0) {
              for (var i = 0; i < webhooks.length; i++) {
                if (i > 2) {
                  result += '. . .';
                  return result;
                }
                var webhook = webhooks[i];
                result += webhook + '<br/>';
              }
            }
            return result;
          },
        },
        {
          targets: 4,
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
      ],
    });

    function goToDetail(id) {
      if (id) {
        window.location = '/App/WebhookSubscription/Detail/' + id;
      }
    }

    $('#CreateNewWebhookSubscription').click(function () {
      _createOrEditModal.open();
    });

    $('#GetSubscriptionsButton').click(function (e) {
      e.preventDefault();
      getWebhooks();
    });

    function getWebhooks() {
      dataTable.ajax.reload();
    }

    abp.event.on('app.createOrEditWebhookSubscriptionModalSaved', function () {
      getWebhooks();
    });
  });
})();
