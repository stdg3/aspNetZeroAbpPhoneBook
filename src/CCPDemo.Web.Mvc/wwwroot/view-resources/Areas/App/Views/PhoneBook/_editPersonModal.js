(function ($) {
    app.modals.EditPersonModal = function () {

        var _modalManager;
        var _personService = abp.services.app.person;
        var _$form = null;

        this.init = function (modalManager) {
            _modalManager = modalManager;
            personId = _modalManager.getArgs().personId;
            _$form = _modalManager.getModal().find('form');
            _$form.validate();
        };

        this.save = function () {
            if (!_$form.valid()) {
                return;
            }

            var person = _$form.serializeFormToObject();

            _modalManager.setBusy(true);
            _personService.editPerson(person).done(function () {
                _modalManager.close();
                location.reload();
            }).always(function () {
                _modalManager.setBusy(false);
            });
        };
    };
})(jQuery);