(function ($) {
  app.modals.CreateOrEditPersonModal = function () {
    var _personsService = abp.services.app.persons;

    var _modalManager;
    var _$personInformationForm = null;

    this.init = function (modalManager) {
      _modalManager = modalManager;

      var modal = _modalManager.getModal();
      modal.find('.date-picker').daterangepicker({
        singleDatePicker: true,
        locale: abp.localization.currentLanguage.name,
        format: 'L',
      });

      _$personInformationForm = _modalManager.getModal().find('form[name=PersonInformationsForm]');
      _$personInformationForm.validate();
    };

    this.save = function () {
      if (!_$personInformationForm.valid()) {
        return;
      }

      var person = _$personInformationForm.serializeFormToObject();

      _modalManager.setBusy(true);
      _personsService
        .createOrEdit(person)
        .done(function () {
          abp.notify.info(app.localize('SavedSuccessfully'));
          _modalManager.close();
          abp.event.trigger('app.createOrEditPersonModalSaved');
        })
        .always(function () {
          _modalManager.setBusy(false);
        });
    };
  };
})(jQuery);
