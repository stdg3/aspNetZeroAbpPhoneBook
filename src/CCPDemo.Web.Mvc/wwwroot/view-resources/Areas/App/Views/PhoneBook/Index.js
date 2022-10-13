(function () {
    var _createPersonModal = new app.ModalManager({
        viewUrl: abp.appPath + 'App/PhoneBook/CreatePersonModal',
        scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/PhoneBook/_CreatePersonModal.js',
        modalClass: 'CreatePersonModal'
    });

    $('#CreateNewPersonButton').click(function (e) {
        e.preventDefault();
        _createPersonModal.open();
    });
})();

var _personService = abp.services.app.person;

$('#AllPeopleList button.delete-person').click(function (e) {
    e.preventDefault();

    var $listItem = $(this).closest('.list-group-item');
    var personId = $listItem.attr('data-person-id');


    abp.message.confirm(
        app.localize('AreYouSureToDeleteThePerson'),
        app.localize('Deleting'),
        function (isConfirmed) {
            if (isConfirmed) {
                _personService.deletePerson({
                    id: personId
                }).done(function () {
                    abp.notify.info(app.localize('SuccessfullyDeleted'));
                    $listItem.remove();
                });
            }
        }
    );


    //var isDeleting = abp.message.confirm(app.localize('AreYouSureToDeleteThePerson'));
        
    //if (isDeleting) {
    //    _personService.deletePerson({
    //        id: personId
    //    })
    //        .done(function () {
    //            abp.notify.info(app.localize('SuccessfullyDeleted'));
    //            $listItem.remove();
    //        });
    //}
        
    
});