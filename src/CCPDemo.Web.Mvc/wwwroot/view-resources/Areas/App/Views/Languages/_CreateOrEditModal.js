(function ($) {
  app.modals.CreateOrEditLanguageModal = function () {
    var _modalManager;
    var _languageService = abp.services.app.language;
    var _$languageInformationForm = null;

    this.init = function (modalManager) {
      _modalManager = modalManager;

      _modalManager.getModal().find('#LanguageNameEdit').select2({
        theme: 'bootstrap5',
        dropdownParent : '.modal',
        selectionCssClass: 'form-select',
        language: abp.localization.currentCulture.name,
        width: '100%',
        dropdownCssClass: "long-select2",
      });

      _modalManager.getModal().find('#LanguageIconEdit').select2({
        theme: 'bootstrap5',
        dropdownParent : '.modal',
        selectionCssClass: 'form-select',
        language: abp.localization.currentCulture.name,
        width: '100%',
        dropdownCssClass: "long-select2",
        templateResult: iconFromValue,
        templateSelection: iconFromValue,
        escapeMarkup: (m) => m,
      });

      function iconFromValue(val){
        if (!val.id) {
          return val.text;
        }
        val = `<i class="${val.element.value}"></i> ${val.text}`;
        return val;
      }

      _$languageInformationForm = _modalManager.getModal().find('form[name=LanguageInformationsForm]');
    };

    this.save = function () {
      var language = _$languageInformationForm.serializeFormToObject();

      _modalManager.setBusy(true);
      _languageService
        .createOrUpdateLanguage({
          language: language,
        })
        .done(function () {
          abp.notify.info(app.localize('SavedSuccessfully'));
          _modalManager.close();
          abp.event.trigger('app.createOrEditLanguageModalSaved');
        })
        .always(function () {
          _modalManager.setBusy(false);
        });
    };
  };
})(jQuery);
