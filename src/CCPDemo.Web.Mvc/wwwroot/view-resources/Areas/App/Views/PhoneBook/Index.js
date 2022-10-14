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

//Edit person button
$('#AllPeopleList button.edit-person').click(function (e) {
    e.preventDefault();

    var $listItem = $(this).closest('.list-group-item');

    $listItem
        .toggleClass('person-editing')
        .siblings().removeClass('person-editing');
});

//Save phone button
$('#AllPeopleList .button-save-phone').click(function (e) {
    e.preventDefault();

    var $phoneEditorRow = $(this).closest('tr');

    abp.ajax({
        url: abp.appPath + 'App/PhoneBook/AddPhone',
        dataType: 'html',
        data: JSON.stringify({
            personId: $phoneEditorRow.closest('.list-group-item').attr('data-person-id'),
            Type: $phoneEditorRow.find('select[name=Type]').val(),
            Number: $phoneEditorRow.find('input[name=Number]').val()
        })
    }).done(function (result) {
        $(result).insertBefore($phoneEditorRow);
    });
});

//Delete phone button
$('#AllPeopleList').on('click', '.button-delete-phone', function (e) {
    e.preventDefault();

    var $phoneRow = $(this).closest('tr');
    var phoneId = $phoneRow.attr('data-phone-id');

    _personService.deletePhone({
        id: phoneId
    }).done(function () {
        abp.notify.success(app.localize('SuccessfullyDeleted'));
        $phoneRow.remove();
    });
});