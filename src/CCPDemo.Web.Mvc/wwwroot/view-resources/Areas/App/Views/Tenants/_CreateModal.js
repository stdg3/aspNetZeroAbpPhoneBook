(function ($) {
  //Custom validation type for tenancy name
  $.validator.addMethod(
    'tenancyNameRegex',
    function (value, element, regexpr) {
      return regexpr.test(value);
    },
    app.localize('TenantName_Regex_Description')
    );


  app.modals.CreateTenantModal = function () {
    var _tenantService = abp.services.app.tenant;
    var _commonLookupService = abp.services.app.commonLookup;
    var _$tenantInformationForm = null;
    var _passwordComplexityHelper = new app.PasswordComplexityHelper();

    var _modalManager;

    var $selectedDateTime = {
        startDate: moment()
    };

    this.init = function (modalManager) {
      _modalManager = modalManager;
      var modal = _modalManager.getModal();

      _$tenantInformationForm = modal.find('form[name=TenantInformationsForm]');
      _$tenantInformationForm.validate({
        rules: {
          TenancyName: {
            tenancyNameRegex: new RegExp(_$tenantInformationForm.find('input[name=TenancyName]').attr('regex')),
          },
        },
      });

      //Show/Hide password inputs when "random password" checkbox is changed.

      var passwordInputs = modal.find('input[name=AdminPassword],input[name=AdminPasswordRepeat]');
      var passwordInputGroups = passwordInputs.closest('.tenant-admin-password');

      _passwordComplexityHelper.setPasswordComplexityRules(passwordInputs, window.passwordComplexitySetting);

      $('#CreateTenant_SetRandomPassword').change(function () {
        if ($(this).is(':checked')) {
          passwordInputGroups.slideUp('fast');
          passwordInputs.removeAttr('required');
        } else {
          passwordInputGroups.slideDown('fast');
          passwordInputs.attr('required', 'required');
        }
      });

      //Show/Hide connection string input when "use host db" checkbox is changed.

      var connStringInput = modal.find('input[name=ConnectionString]');
      var connStringInputGroup = connStringInput.closest('.form-group');

      $('#CreateTenant_UseHostDb').change(function () {
        if ($(this).is(':checked')) {
          connStringInputGroup.slideUp('fast');
          connStringInput.removeAttr('required');
        } else {
          connStringInputGroup.slideDown('fast');
          connStringInput.attr('required', 'required');
        }
      });

      modal.find('.date-time-picker').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        parentEl: '#CreateTenantInformationsForm',
        startDate: moment().startOf('minute'),
        locale: {
            format: "L LT"
        },
      }, (start) => $selectedDateTime.startDate = start);

      var $subscriptionEndDateDiv = modal.find('input[name=SubscriptionEndDateUtc]').parent('div');
      var $isUnlimitedInput = modal.find('#CreateTenant_IsUnlimited');
      var subscriptionEndDateUtcInput = modal.find('input[name=SubscriptionEndDateUtc]');
      function toggleSubscriptionEndDateDiv() {
        if ($isUnlimitedInput.is(':checked')) {
          $subscriptionEndDateDiv.slideUp('fast');
          subscriptionEndDateUtcInput.removeAttr('required');
        } else {
          $subscriptionEndDateDiv.slideDown('fast');
          subscriptionEndDateUtcInput.attr('required', 'required');
        }
      }

      var $isInTrialPeriodInputDiv = modal.find('#CreateTenant_IsInTrialPeriod').closest('div');
      var $isInTrialPeriodInput = modal.find('#CreateTenant_IsInTrialPeriod');
      function toggleIsInTrialPeriod() {
        if ($isUnlimitedInput.is(':checked')) {
          $isInTrialPeriodInputDiv.slideUp('fast');
          $isInTrialPeriodInput.prop('checked', false);
        } else {
          $isInTrialPeriodInputDiv.slideDown('fast');
        }
      }

      $isUnlimitedInput.change(function () {
        toggleSubscriptionEndDateDiv();
        toggleIsInTrialPeriod();
      });

      var $editionCombobox = modal.find('#EditionId');
      $editionCombobox.change(function () {
        var isFree = $('option:selected', this).attr('data-isfree') === 'True';
        var selectedValue = $('option:selected', this).val();

        if (selectedValue === '' || isFree) {
          modal.find('.subscription-component').slideUp('fast');
          if (isFree) {
            $isUnlimitedInput.prop('checked', true);
          } else {
            $isUnlimitedInput.prop('checked', false);
          }
        } else {
          $isUnlimitedInput.prop('checked', false);
          toggleSubscriptionEndDateDiv();
          toggleIsInTrialPeriod();
          modal.find('.subscription-component').slideDown('fast');
        }
      });

      toggleSubscriptionEndDateDiv();
      toggleIsInTrialPeriod();
      $editionCombobox.trigger('change');

      getDefaultEdition();
    };

    this.save = function () {
      if (!_$tenantInformationForm.valid()) {
        return;
      }
      var tenant = _$tenantInformationForm.serializeFormToObject();

      //take selected date as UTC
      if ($('#CreateTenant_IsUnlimited').is(':visible') && !$('#CreateTenant_IsUnlimited').is(':checked')) {
          tenant.SubscriptionEndDateUtc = $selectedDateTime.startDate.format('YYYY-MM-DDTHH:mm:ss') + 'Z';
      } else {
        tenant.SubscriptionEndDateUtc = null;
      }

      if ($('#CreateTenant_IsUnlimited').is(':checked')) {
        tenant.IsInTrialPeriod = false;
      }

      if (tenant.SetRandomPassword) {
        tenant.Password = null;
        tenant.AdminPassword = null;
      }

      if (tenant.UseHostDb) {
        tenant.ConnectionString = null;
      }

      _modalManager.setBusy(true);
      _tenantService
        .createTenant(tenant)
        .done(function () {
          abp.notify.info(app.localize('SavedSuccessfully'));
          _modalManager.close();
          abp.event.trigger('app.createTenantModalSaved');
        })
        .always(function () {
          _modalManager.setBusy(false);
        });
    };

    function getDefaultEdition() {
      _commonLookupService.getDefaultEditionName().done(function (defaultEdition) {
        var $editionCombobox = _modalManager.getModal().find('#EditionId');
        $editionCombobox.find('option').each(function () {
          if ($(this).text() == defaultEdition.name) {
            $(this).prop('selected', true).trigger('change');
          }
        });
      });
    }
  };
})(jQuery);
