$(function () {
  var _uiCustomizationSettingsService = abp.services.app.uiCustomizationSettings;
  
  $('.theme-selection-link').click(function () {
    var theme = $(this).data('theme');

    _uiCustomizationSettingsService.changeThemeWithDefaultValues(theme).done(function () {
      window.location.reload();
    });
  });
});
