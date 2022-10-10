(function ($) {
  $(function () {
    // Back to my account

    $('#UserProfileBackToMyAccountButton').click(function (e) {
      e.preventDefault();
      abp.ajax({
        url: abp.appPath + 'Account/BackToImpersonator',
        success: function () {
          if (!app.supportsTenancyNameInUrl) {
            abp.multiTenancy.setTenantIdCookie(abp.session.impersonatorTenantId);
          }
        },
      });
    });

    //My settings

    var mySettingsModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/Profile/MySettingsModal',
      scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Profile/_MySettingsModal.js',
      modalClass: 'MySettingsModal',
    });

    $('#UserProfileMySettingsLink').click(function (e) {
      e.preventDefault();
      mySettingsModal.open();
    });

    $('#UserDownloadCollectedDataLink').click(function (e) {
      e.preventDefault();
      abp.services.app.profile.prepareCollectedData().done(function () {
        abp.message.success(app.localize('GdprDataPrepareStartedNotification'));
      });
    });

    // Change password

    var changePasswordModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/Profile/ChangePasswordModal',
      scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Profile/_ChangePasswordModal.js',
      modalClass: 'ChangePasswordModal',
    });

    $('#UserProfileChangePasswordLink').click(function (e) {
      e.preventDefault();
      changePasswordModal.open();
    });

    // Change profile picture

    var changeProfilePictureModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/Profile/ChangePictureModal',
      scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Profile/_ChangePictureModal.js',
      modalClass: 'ChangeProfilePictureModal',
    });

    $('#UserProfileChangePictureLink').click(function (e) {
      e.preventDefault();
      changeProfilePictureModal.open();
    });

    // Manage linked accounts
    var _userLinkService = abp.services.app.userLink;

    var manageLinkedAccountsModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/Profile/LinkedAccountsModal',
      scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Profile/_LinkedAccountsModal.js',
      modalClass: 'LinkedAccountsModal',
    });

    $('#ManageLinkedAccountsLink').click(function (e) {
      e.preventDefault();
      manageLinkedAccountsModal.open();
    });

    var getRecentlyLinkedUsers = function () {
      _userLinkService.getRecentlyUsedLinkedUsers().done(function (result) {
        loadRecentlyUsedLinkedUsers(result);

        $('.recently-linked-user').click(function (e) {
          e.preventDefault();
          var userId = $(this).attr('data-user-id');
          var tenantId = $(this).attr('data-tenant-id');
          if (userId) {
            switchToUser(userId, tenantId);
          }
        });
      });
    };

    function loadRecentlyUsedLinkedUsers(result) {
      var $ul = $('div#RecentlyUsedLinkedUsers');

      $.each(result.items, function (index, linkedUser) {
        linkedUser.shownUserName = app.getShownLinkedUserName(linkedUser);
      });

      result.hasLinkedUsers = function () {
        return this.items.length > 0;
      };

      var template = $('#linkedAccountsSubMenuTemplate').html();
      Mustache.parse(template);
      var rendered = Mustache.render(template, result);
      $ul.html(rendered);

      if (!result || !result.items || !result.items.length) {
        $('#RecentlyUsedLinkedUsers').closest('div').hide();
      }
    }

    function switchToUser(linkedUserId, linkedTenantId) {
      abp.ajax({
        url: abp.appPath + 'Account/SwitchToLinkedAccount',
        data: JSON.stringify({
          targetUserId: linkedUserId,
          targetTenantId: linkedTenantId,
        }),
        success: function () {
          if (!app.supportsTenancyNameInUrl) {
            abp.multiTenancy.setTenantIdCookie(linkedTenantId);
          }
        },
      });
    }

    manageLinkedAccountsModal.onClose(function () {
      getRecentlyLinkedUsers();
    });

    // Notifications
    var _appUserNotificationHelper = new app.UserNotificationHelper();
    var _notificationService = abp.services.app.notification;

    function bindNotificationEvents() {
      $('#setAllNotificationsAsReadLink').click(function (e) {
        e.preventDefault();
        e.stopPropagation();

        _appUserNotificationHelper.setAllAsRead(function () {
          loadNotifications();
        });
      });

      $('.set-notification-as-read').click(function (e) {
        e.preventDefault();
        e.stopPropagation();

        var notificationId = $(this).attr('data-notification-id');
        if (notificationId) {
          _appUserNotificationHelper.setAsRead(notificationId, function () {
            loadNotifications();
          });
        }
      });

      $('#openNotificationSettingsModalLink').click(function (e) {
        e.preventDefault();
        e.stopPropagation();

        _appUserNotificationHelper.openSettingsModal();
      });

      $('a.user-notification-item-clickable').click(function () {
        var url = $(this).attr('data-url');
        document.location.href = url;
      });
    }

    function loadNotifications() {
      _notificationService
        .getUserNotifications({
          maxResultCount: 3,
        })
        .done(function (result) {
          result.notifications = [];
          result.unreadMessageExists = result.unreadCount > 0;
          $.each(result.items, function (index, item) {
            var formattedItem = _appUserNotificationHelper.format(item);
            result.notifications.push(formattedItem);
          });

          var $li = $('#header_notification_bar');

          var template = $('#headerNotificationBarTemplate').html();
          Mustache.parse(template);
          var rendered = Mustache.render(template, result);

          $li.html(rendered);

          bindNotificationEvents();
        });
    }

    abp.event.on('abp.notifications.received', function (userNotification) {
      _appUserNotificationHelper.show(userNotification);
      loadNotifications();
    });

    abp.event.on('app.notifications.refresh', function () {
      loadNotifications();
    });

    abp.event.on('app.notifications.read', function (userNotificationId) {
      loadNotifications();
    });

    // Chat
    abp.event.on('app.chat.unreadMessageCountChanged', function (messageCount) {
      $('#chatIconUnRead .unread-chat-message-count').text(messageCount);

      if (messageCount) {
        $('#chatIconUnRead').removeClass('d-none');
        $('#chatIcon').addClass('d-none');
      } else {
        $('#chatIconUnRead').addClass('d-none');
        $('#chatIcon').removeClass('d-none');
      }
    });

    // User Delegation
    var userDelegationsModal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/Profile/UserDelegationsModal',
      scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Profile/_UserDelegationsModal.js',
      modalClass: 'UserDelegationsModal',
    });

    $('#ManageUserDelegations').click(function (e) {
      e.preventDefault();
      userDelegationsModal.open();
    });

    $('#ActiveUserDelegationsCombobox').click(function () {
      var $activeUserDelegationsCombobox = $(this);
      var userDelegationId = parseInt($activeUserDelegationsCombobox.val());
      if (userDelegationId <= 0 || !userDelegationId) {
        return;
      }

      var username = $activeUserDelegationsCombobox.children('option:selected').attr('data-username');

      abp.message.confirm(
        app.localize('SwitchToDelegatedUserWarningMessage', username),
        app.localize('AreYouSure'),
        function (isConfirmed) {
          if (isConfirmed) {
            $activeUserDelegationsCombobox.attr('data-value', userDelegationId);
            abp.ajax({
              url: abp.appPath + 'Account/DelegatedImpersonate',
              data: JSON.stringify({
                userDelegationId: userDelegationId,
              }),
            });
          } else {
            $activeUserDelegationsCombobox.val($activeUserDelegationsCombobox.attr('data-value'));
            return false;
          }
        }
      );
    });

    // Init

    function init() {
      loadNotifications();
      getRecentlyLinkedUsers();
    }

    init();
  });
})(jQuery);
