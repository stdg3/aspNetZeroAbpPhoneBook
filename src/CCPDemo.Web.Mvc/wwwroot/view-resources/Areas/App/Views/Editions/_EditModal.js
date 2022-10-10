(function () {
  app.modals.EditEditionModal = function () {
    var _modalManager;
    var editionService = abp.services.app.edition;
    var $editionInformationForm = null;
    var featuresTree;

    this.init = function (modalManager) {
      _modalManager = modalManager;
      var $modal = _modalManager.getModal();

      featuresTree = new FeaturesTree();
      featuresTree.init($modal.find('.feature-tree'));

      $editionInformationForm = _modalManager.getModal().find('form[name=EditionInformationsForm]');
      $editionInformationForm.validate();
    };

    this.save = function () {
      if (!$editionInformationForm.valid()) {
        return;
      }

      if (!featuresTree.isValid()) {
        abp.message.warn(app.localize('InvalidFeaturesWarning'));
        return;
      }

      var edition = $editionInformationForm.serializeFormToObject();

      _modalManager.setBusy(true);
      editionService
        .updateEdition({
          edition: edition,
          featureValues: featuresTree.getFeatureValues(),
        })
        .done(function () {
          abp.notify.info(app.localize('SavedSuccessfully'));
          _modalManager.close();
          abp.event.trigger('app.createOrEditEditionModalSaved');
        })
        .always(function () {
          _modalManager.setBusy(false);
        });
    };
  };
})();
