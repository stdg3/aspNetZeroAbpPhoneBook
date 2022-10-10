(function () {
  app.modals.CreateNewUserDelegationModal = function () {
    var __userDelegationService = abp.services.app.userDelegation;

    var _modalManager;
    var _$form = null;
    var modal = null;

    var openUserSearchModal = function () {
      var lookupModal = app.modals.LookupModal.create({
        title: app.localize('SelectAUser'),
        serviceMethod: abp.services.app.commonLookup.findUsers,
        filterText: '',
        excludeCurrentUser: true,
      });

      lookupModal.open({}, function (selectedItem) {
        var userId = selectedItem.value;
        $('#TargetUserId').val(userId);
        $('#UsernameOrEmailAddress').val(selectedItem.name);
      });
    };

    this.init = function (modalManager) {
      _modalManager = modalManager;
      modal = _modalManager.getModal();

      _$form = modal.find('form[name=DelegateUserModalForm]');
      _$form.validate();

      var $StartTime = modal.find('#StartTime');
      var $EndTime = modal.find('#EndTime');

      var $selectedDateTime = {
          startDate: moment(),
          endDate: moment(),
      };

      $StartTime
        .daterangepicker({
          timePicker: true,
          singleDatePicker: true,
          parentEl: "#DelegateUserModalForm",
          startDate: moment().startOf('minute'),
          locale: {
              format: "L LT"
          },
        }, (start) => {
            $selectedDateTime.startDate = start;
            $EndTime.data('daterangepicker').minDate = start;
        })


      $EndTime
        .daterangepicker({
          timePicker: true,
          singleDatePicker: true,
          parentEl: "#DelegateUserModalForm",
          startDate: moment().startOf('minute'),
          locale: {
              format: "L LT"
          },
        }, (start) => {
            $selectedDateTime.endDate = start;
            $StartTime.data('daterangepicker').maxDate = start;
        })

      modal
        .find('#UsernameOrEmailAddress')
        .closest('.input-group')
        .click(function () {
          openUserSearchModal();
        });
    };

    this.save = function () {
      if (!_$form.valid()) {
        return;
      }

      var userDelegation = _$form.serializeFormToObject();

      _modalManager.setBusy(true);
      __userDelegationService
        .delegateNewUser(userDelegation)
        .done(function (result) {
          abp.notify.info(app.localize('SavedSuccessfully'));
          _modalManager.setResult(result);
          _modalManager.close();
        })
        .always(function () {
          _modalManager.setBusy(false);
        });
    };
  };
})();
