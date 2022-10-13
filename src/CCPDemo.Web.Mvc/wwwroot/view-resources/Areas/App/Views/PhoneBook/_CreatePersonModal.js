(function ($) {
    app.modals.CreatePersonModal = function () {
        var _modalManager;
        var _personService = abp.services.app.person;
        var _$form = null;

        this.init = function (modalManager) {
            _modalManager = modalManager;

            _$form = _modalManager.getModal().find('form');
            _$form.validate();
        };

        this.save = function () {
            if (!_$form.valid()) {
                return;
            }

            var person = _$form.serializeFormToObject();

            _modalManager.setBusy(true);
            _personService.createPerson(person).done(function () {
                _modalManager.close();
                location.reload();
            }).always(function () {
                _modalManager.setBusy(false);
            });
        };
    };
})(jQuery);
