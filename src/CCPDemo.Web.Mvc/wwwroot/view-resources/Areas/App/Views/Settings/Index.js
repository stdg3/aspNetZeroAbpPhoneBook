(function () {
  $(function () {
    var _tenantSettingsService = abp.services.app.tenantSettings;
    var _initialTimeZone = $('#GeneralSettingsForm [name=Timezone]').val();
    var _usingDefaultTimeZone =
      $('#GeneralSettingsForm [name=TimezoneForComparison]').val() === abp.setting.values['Abp.Timing.TimeZone'];
    var _openIdConnectClaimsManager = new KeyValueListManager();
    var _wsFederationClaimsManager = new KeyValueListManager();
    var _initialEmailSettings = $('#EmailSmtpSettingsForm').serializeFormToObject();

    //Toggle form based registration options
    var _$selfRegistrationOptions = $('#FormBasedRegistrationSettingsForm').find(
      '#Setting_AllowSelfRegistration_Content'
    );

    var _$SessionTimeOutItems = $('#FormBasedRegistrationSettingsForm').find('.divSessionTimeOut');

    $('#Settings_UseHostDefaultEmailSettings').change(function () {
      if (this.checked) {
        $('.Settings_Email_Group').slideUp();
      } else {
        $('.Settings_Email_Group').slideDown();
      }
    });

    function toggleSelfRegistrationOptions() {
      if ($('#Setting_AllowSelfRegistration').is(':checked')) {
        _$selfRegistrationOptions.slideDown('fast');
      } else {
        _$selfRegistrationOptions.slideUp('fast');
      }
    }

    function toggleSessionTimeOutItems() {
      if ($('#Setting_IsSessionTimeOutEnabled').is(':checked')) {
        _$SessionTimeOutItems.slideDown('fast');
      } else {
        _$SessionTimeOutItems.slideUp('fast');
      }
    }

    $('#Setting_AllowSelfRegistration').change(function () {
      toggleSelfRegistrationOptions();
    });

    toggleSelfRegistrationOptions();
    toggleSessionTimeOutItems();

    //Toggle SMTP credentials
    var _$smtpCredentialFormGroups = $('#EmailSmtpSettingsForm')
      .find('input[name=SmtpDomain],input[name=SmtpUserName],input[name=SmtpPassword]')
      .closest('.form-group');

    function toggleSmtpCredentialFormGroups() {
      if ($('#Settings_SmtpUseDefaultCredentials').is(':checked')) {
        _$smtpCredentialFormGroups.slideUp('fast');
      } else {
        _$smtpCredentialFormGroups.slideDown('fast');
      }
    }

    $('#Settings_SmtpUseDefaultCredentials').change(function () {
      toggleSmtpCredentialFormGroups();
    });

    $('#Setting_IsSessionTimeOutEnabled').change(function () {
      toggleSessionTimeOutItems();
    });

    toggleSmtpCredentialFormGroups();

    //Toggle LDAP credentials
    var _$ldapCredentialFormGroups = $('#LdapSettingsForm')
      .find('input[name=Domain],input[name=UserName],input[name=Password]')
      .closest('.form-group');

    function toggleLdapCredentialFormGroups() {
      if ($('#Setting_LdapIsEnabled').is(':checked')) {
        _$ldapCredentialFormGroups.slideDown('fast');
      } else {
        _$ldapCredentialFormGroups.slideUp('fast');
      }
    }

    toggleLdapCredentialFormGroups();

    $('#Setting_LdapIsEnabled').change(function () {
      toggleLdapCredentialFormGroups();
    });

    //Toggle User lockout

    var _$userLockOutSettingsFormItems = $('#UserLockOutSettingsForm')
      .find('input')
      .not('#Setting_UserLockOut_IsEnabled')
      .closest('.form-group');

    function toggleUserLockOutSettingsFormItems() {
      if ($('#Setting_UserLockOut_IsEnabled').is(':checked')) {
        _$userLockOutSettingsFormItems.slideDown('fast');
      } else {
        _$userLockOutSettingsFormItems.slideUp('fast');
      }
    }

    toggleUserLockOutSettingsFormItems();

    $('#Setting_UserLockOut_IsEnabled').change(function () {
      toggleUserLockOutSettingsFormItems();
    });

    //Toggle two factor login

    var _$twoFactorLoginSettingsFormItems = $('#TwoFactorLoginSettingsForm')
      .find('input')
      .not('#Setting_TwoFactorLogin_IsEnabled')
      .closest('.checkbox');

    function toggleTwoFactorLoginSettingsFormItems() {
      if ($('#Setting_TwoFactorLogin_IsEnabled').is(':checked')) {
        _$twoFactorLoginSettingsFormItems.slideDown('fast');
      } else {
        _$twoFactorLoginSettingsFormItems.slideUp('fast');
      }
    }

    toggleTwoFactorLoginSettingsFormItems();

    $('#Setting_TwoFactorLogin_IsEnabled').change(function () {
      toggleTwoFactorLoginSettingsFormItems();
    });

    //Security
    $('#Setting_PasswordComplexity_UseDefaultSettings').change(function (val) {
      if ($(this).prop('checked')) {
        $('#PasswordComplexitySettingsForm').hide('fast', function () {
          $('#DefaultPasswordComplexitySettingsForm').show('fast');
        });
      } else {
        $('#DefaultPasswordComplexitySettingsForm').hide('fast', function () {
          $('#PasswordComplexitySettingsForm').show('fast');
        });
      }
    });

    function getDefaultPasswordComplexitySettings() {
      //note: this is a fix for '$('#DefaultPasswordComplexitySettingsForm').serializeFormToObject()' always returns true for checkboxes if they are disabled.
      var $disabledDefaultPasswordInputs = $('#DefaultPasswordComplexitySettingsForm input:disabled');
      $disabledDefaultPasswordInputs.removeAttr('disabled');
      var defaultPasswordComplexitySettings = $('#DefaultPasswordComplexitySettingsForm').serializeFormToObject();
      $disabledDefaultPasswordInputs.attr('disabled', 'disabled');
      var $checkboxes = $('#DefaultPasswordComplexitySettingsForm input:checkbox');
      $checkboxes.closest('checkbox');
      $checkboxes.addClass('disabled');
      return defaultPasswordComplexitySettings;
    }

    //Appearance/Logo
    $('#SettingsLogoUploadForm').ajaxForm({
      beforeSubmit: function (formData, jqForm, options) {
        var $fileInput = $('#SettingsLogoUploadForm input[name=ApplicationLogoImage]');
        var files = $fileInput.get()[0].files;

        if (!files.length) {
          return false;
        }

        var file = files[0];

        //File type check
        var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
        if ('|jpg|jpeg|png|gif|'.indexOf(type) === -1) {
          abp.message.warn(app.localize('File_Invalid_Type_Error'));
          return false;
        }

        //File size check
        if (file.size > 30720) {
          //30KB
          abp.message.warn(app.localize('File_SizeLimit_Error'));
          return false;
        }

        return true;
      },
      success: function (response) {
        if (response.success) {
          refreshLogo(
            abp.appPath +
              'TenantCustomization/GetLogo?tenantId=' +
              response.result.tenantId +
              '&t=' +
              new Date().getTime()
          );
          abp.notify.info(app.localize('SavedSuccessfully'));
        } else {
          abp.message.error(response.error.message);
        }
      },
    });

    $('#SettingsLogoUploadForm button[type=reset]').click(function () {
      _tenantSettingsService.clearLogo().done(function () {
        refreshLogo(abp.appPath + 'Common/Images/app-logo-on-light.svg');
        $('.brand-logo-preview-area').css('display', 'none');
        $('#ApplicationLogoImageLabel').text(app.localize('ChooseAFile'));

        abp.notify.info(app.localize('ClearedSuccessfully'));
      });
    });

    function refreshLogo(url) {
      $('.brand-logo img').attr('src', url);
      $('.brand-logo-preview-area').css('display', 'block');
      $('.brand-logo-preview-area img').attr('src', url);
    }

    //Appearance/Custom CSS
    $('#SettingsCustomCssUploadForm').ajaxForm({
      beforeSubmit: function (formData, jqForm, options) {
        var $fileInput = $('#SettingsCustomCssUploadForm input[name=CustomCssFile]');
        var files = $fileInput.get()[0].files;

        if (!files.length) {
          return false;
        }

        var file = files[0];

        //File type check
        var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
        if ('|css|'.indexOf(type) === -1) {
          abp.message.warn(app.localize('File_Invalid_Type_Error'));
          return false;
        }

        //File size check
        if (file.size > 1048576) {
          //1MB
          abp.message.warn(app.localize('File_SizeLimit_Error'));
          return false;
        }

        return true;
      },
      success: function (response) {
        if (response.success) {
          refreshCustomCss(abp.appPath + 'TenantCustomization/GetCustomCss?tenantId=' + response.result.tenantId);
          $('#getCustomCssLink').css('display', 'block');
          abp.notify.info(app.localize('SavedSuccessfully'));
        } else {
          abp.message.error(response.error.message);
        }
      },
    });

    $('#SettingsCustomCssUploadForm button[type=reset]').click(function () {
      _tenantSettingsService.clearCustomCss().done(function () {
        refreshCustomCss(null);
        $('#getCustomCssLink').css('display', 'none');
        abp.notify.info(app.localize('ClearedSuccessfully'));
      });
    });

    function refreshCustomCss(url) {
      $('#TenantCustomCss').remove();
      if (url) {
        $('head').append('<link id="TenantCustomCss" href="' + url + '" rel="stylesheet"/>');
      }
    }

    //Save settings
    $('#SaveAllSettingsButton').click(function () {
      if (!IsSmtpSettingsFormValid()) {
        return;
      }

      var userManagement = $.extend(
        $('#FormBasedRegistrationSettingsForm').serializeFormToObject(),
        $('#UserManagementOtherSettingsForm').serializeFormToObject()
      );
      userManagement.sessionTimeOutSettings = {
        isEnabled: $('#Setting_IsSessionTimeOutEnabled').is(':checked'),
        timeOutSecond: $('#Setting_SessionTimeOutSecond').val(),
        showTimeOutNotificationSecond: $('#Setting_ShowTimeOutNotificationSecond').val(),
        showLockScreenWhenTimedOut: $('#Setting_ShowLockScreenWhenTimedOut').is(':checked'),
      };

      _tenantSettingsService
        .updateAllSettings({
          general: $('#GeneralSettingsForm').serializeFormToObject(),
          userManagement: userManagement,
          email: $('#EmailSmtpSettingsForm').serializeFormToObject(),
          ldap: $('#LdapSettingsForm').serializeFormToObject(),
          billing: $('#BillingSettingsForm').serializeFormToObject(),
          otherSettings: $('#OtherSettingsForm').serializeFormToObject(),
          security: {
            useDefaultPasswordComplexitySettings: $('#Setting_PasswordComplexity_UseDefaultSettings').is(':checked'),
            passwordComplexity: $('#PasswordComplexitySettingsForm').serializeFormToObject(),
            defaultPasswordComplexity: getDefaultPasswordComplexitySettings(),
            userLockOut: $('#UserLockOutSettingsForm').serializeFormToObject(),
            twoFactorLogin: $('#TwoFactorLoginSettingsForm').serializeFormToObject(),
            AllowOneConcurrentLoginPerUser: $('#Setting_AllowOneConcurrentLoginPerUser').is(':checked'),
          },
          externalLoginProviderSettings: {
            facebook_IsDeactivated: $('#Setting_Facebook_IsDeactivated').prop('checked'),
            facebook: {
              appId: $('#Setting_Facebook_AppId').val(),
              appSecret: $('#Setting_Facebook_AppSecret').val(),
            },
            google_IsDeactivated: $('#Setting_Google_IsDeactivated').prop('checked'),
            google: {
              clientId: $('#Setting_Google_ClientId').val(),
              clientSecret: $('#Setting_Google_ClientSecret').val(),
              userInfoEndpoint: $('#Setting_Google_UserInfoEndpoint').val(),
            },
            twitter_IsDeactivated: $('#Setting_Twitter_IsDeactivated').prop('checked'),
            twitter: {
              consumerKey: $('#Setting_Twitter_ConsumerKey').val(),
              consumerSecret: $('#Setting_Twitter_ConsumerSecret').val(),
            },
            microsoft_IsDeactivated: $('#Setting_Microsoft_IsDeactivated').prop('checked'),
            microsoft: {
              clientId: $('#Setting_Microsoft_ClientId').val(),
              clientSecret: $('#Setting_Microsoft_ClientSecret').val(),
            },
            openIdConnect_IsDeactivated: $('#Setting_OpenIdConnect_IsDeactivated').prop('checked'),
            openIdConnect: {
              clientId: $('#Setting_OpenIdConnect_ClientId').val(),
              clientSecret: $('#Setting_OpenIdConnect_ClientSecret').val(),
              authority: $('#Setting_OpenIdConnect_Authority').val(),
              validateIssuer: $('#Setting_OpenIdConnect_ValidateIssuer').prop('checked'),
            },
            openIdConnectClaimsMapping: _openIdConnectClaimsManager.getValues().map((x) => {
              return {
                key: x.key,
                claim: x.value,
              };
            }),
            wsFederation_IsDeactivated: $('#Setting_WsFederation_IsDeactivated').prop('checked'),
            wsFederation: {
              clientId: $('#Setting_WsFederation_ClientId').val(),
              tenant: $('#Setting_WsFederation_Tenant').val(),
              metaDataAddress: $('#Setting_WsFederation_MetaDataAddress').val(),
              wtrealm: $('#Setting_WsFederation_Wtrealm').val(),
              authority: $('#Setting_WsFederation_Authority').val(),
            },
            wsFederationClaimsMapping: _wsFederationClaimsManager.getValues().map((x) => {
              return {
                key: x.key,
                claim: x.value,
              };
            }),
          },
        })
        .done(function () {
          abp.notify.info(app.localize('SavedSuccessfully'));

          var newTimezone = $('#GeneralSettingsForm [name=Timezone]').val();
          if (
            abp.clock.provider.supportsMultipleTimezone &&
            _usingDefaultTimeZone &&
            _initialTimeZone !== newTimezone
          ) {
            abp.message.info(app.localize('TimeZoneSettingChangedRefreshPageNotification')).done(function () {
              window.location.reload();
            });
          }
          _initialEmailSettings = $('#EmailSmtpSettingsForm').serializeFormToObject();
        });
    });

    $('#SendTestEmailButton').click(function () {
      if (!$('#EmailSmtpSettingsTestForm').valid()) {
        return;
      }

      var currentEmailSettings = $('#EmailSmtpSettingsForm').serializeFormToObject();

      if (JSON.stringify(_initialEmailSettings) !== JSON.stringify(currentEmailSettings)) {
        abp.message.confirm(
          app.localize('SendEmailWithSavedSettingsWarning'),
          app.localize('AreYouSure'),
          function (isConfirmed) {
            if (isConfirmed) {
              _tenantSettingsService
                .sendTestEmail({
                  emailAddress: $('#TestEmailAddressInput').val(),
                })
                .done(function () {
                  abp.notify.info(app.localize('TestEmailSentSuccessfully'));
                });
            }
          }
        );
      } else {
        _tenantSettingsService
          .sendTestEmail({
            emailAddress: $('#TestEmailAddressInput').val(),
          })
          .done(function () {
            abp.notify.info(app.localize('TestEmailSentSuccessfully'));
          });
      }
    });

    $('.passwordShowButton').click(function () {
      var itemId = $(this).data('id');
      var item = $('#' + itemId);
      if (item) {
        if (item[0].type === 'password') {
          item[0].type = 'text';

          $(this).find('i').removeClass('fa-eye');
          $(this).find('i').addClass('fa-eye-slash');
          $(this).find('span').text(app.localize('Hide'));
        } else {
          item[0].type = 'password';

          $(this).find('i').removeClass('fa-eye-slash');
          $(this).find('i').addClass('fa-eye');
          $(this).find('span').text(app.localize('Show'));
        }
      }
    });

    function initializeOpenIdConnectClaimsMappings() {
      _openIdConnectClaimsManager.init({
        containerId: 'claimsMappingsContainer',
        name: 'openIdConnectClaimsMappings',
        keyName: 'ClaimKey',
        valueName: 'ClaimValue',
        items: openIdConnectClaimsMappings.map((x) => {
          return {
            key: x.Key,
            value: x.Claim,
          };
        }),
      });
    }

    initializeOpenIdConnectClaimsMappings();

    function initializeWsFederationClaimsMappings() {
      _wsFederationClaimsManager.init({
        containerId: 'Setting_WsFederation_ClaimsMappingsContainer',
        name: 'wsFederationClaimsMappings',
        keyName: 'ClaimKey',
        valueName: 'ClaimValue',
        items: wsFederationClaimsMappings.map((x) => {
          return {
            key: x.Key,
            value: x.Claim,
          };
        }),
      });
    }

    initializeWsFederationClaimsMappings();

    $('#Setting_Microsoft_UseHostSettings').change(function () {
      if ($(this).prop('checked')) {
        $('#Setting_Microsoft_ClientId').val('');
        $('#Setting_Microsoft_ClientSecret').val('');
        $('#ExternalLoginMicrosoftSettingsForm .collapse').collapse('hide');
        $('#Setting_Microsoft_IsDeactivated').prop('checked', false);
      } else {
        $('#ExternalLoginMicrosoftSettingsForm .collapse').collapse('show');
      }
    });

    $('#Setting_Twitter_UseHostSettings').change(function () {
      if ($(this).prop('checked')) {
        $('#Setting_Twitter_ConsumerKey').val('');
        $('#Setting_Twitter_ConsumerSecret').val('');
        $('#ExternalLoginTwitterSettingsForm .collapse').collapse('hide');
        $('#Setting_Twitter_IsDeactivated').prop('checked', false);
      } else {
        $('#ExternalLoginTwitterSettingsForm .collapse').collapse('show');
      }
    });

    $('#Setting_Google_UseHostSettings').change(function () {
      if ($(this).prop('checked')) {
        $('#Setting_Google_ClientId').val('');
        $('#Setting_Google_ClientSecret').val('');
        $('#Setting_Google_UserInfoEndpoint').val('');
        $('#ExternalLoginGoogleSettingsForm .collapse').collapse('hide');
        $('#Setting_Google_IsDeactivated').prop('checked', false);
      } else {
        $('#ExternalLoginGoogleSettingsForm .collapse').collapse('show');
      }
    });

    $('#Setting_Facebook_UseHostSettings').change(function () {
      if ($(this).prop('checked')) {
        $('#Setting_Facebook_AppId').val('');
        $('#Setting_Facebook_AppSecret').val('');
        $('#ExternalLoginFacebookSettingsForm .collapse').collapse('hide');
        $('#Setting_Facebook_IsDeactivated').prop('checked', false);
      } else {
        $('#ExternalLoginFacebookSettingsForm .collapse').collapse('show');
      }
    });

    $('#Setting_OpenIdConnect_UseHostSettings').change(function () {
      if ($(this).prop('checked')) {
        $('#Setting_OpenIdConnect_ClientId').val('');
        $('#Setting_OpenIdConnect_ClientSecret').val('');
        $('#Setting_OpenIdConnect_Authority').val('');
        $('#Setting_OpenIdConnect_ValidateIssuer').val('');

        $('#ExternalLoginOpenIdConnectSettingsForm .collapse').collapse('hide');
        $('#Setting_OpenIdConnect_IsDeactivated').prop('checked', false);
      } else {
        $('#ExternalLoginOpenIdConnectSettingsForm .collapse').collapse('show');
      }
    });

    $('#Setting_WsFederation_UseHostSettings').change(function () {
      if ($(this).prop('checked')) {
        $('#Setting_WsFederation_ClientId').val('');
        $('#Setting_WsFederation_Tenant').val('');
        $('#Setting_WsFederation_MetaDataAddress').val('');
        $('#Setting_WsFederation_Authority').val('');
        $('#Setting_WsFederation_Wtrealm').val('');

        $('#ExternalLoginWsFederationSettingsForm .collapse').collapse('hide');
        $('#Setting_WsFederation_IsDeactivated').prop('checked', false);
      } else {
        $('#ExternalLoginWsFederationSettingsForm .collapse').collapse('show');
      }
    });

    function initializeFormValidations() {
      $('#EmailSmtpSettingsForm').validate();
      $('#EmailSmtpSettingsTestForm').validate();
    }

    initializeFormValidations();

    function IsSmtpSettingsFormValid() {
      if (!$('#EmailSmtpSettingsForm').length) {
        return true;
      }
      return $('#EmailSmtpSettingsForm').valid();
    }

    $('#ApplicationLogoImage').change(function () {
      var fileName = app.localize('ChooseAFile');
      if (this.files && this.files[0]) {
        fileName = this.files[0].name;
      }
      $('#ApplicationLogoImageLabel').text(fileName);
    });

    $('#CustomCssFile').change(function () {
      var fileName = app.localize('ChooseAFile');
      if (this.files && this.files[0]) {
        fileName = this.files[0].name;
      }
      $('#CustomCssFileLabel').text(fileName);
    });
  });
})();
