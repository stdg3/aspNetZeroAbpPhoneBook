$(function () {
    var _uiCustomizationSettingsService = abp.services.app.uiCustomizationSettings;
    $('.change-dark-mode-button').click(function () {
        var isActive = $(this).data('isdarkmodeactive');

        _uiCustomizationSettingsService.changeDarkModeOfCurrentTheme(isActive).done(function () {
            window.location.reload();
        });
    });
});
