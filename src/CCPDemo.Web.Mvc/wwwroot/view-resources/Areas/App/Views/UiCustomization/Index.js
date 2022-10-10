(function ($) {
  $(function () {
    var _uiCustomizationSettingsService = abp.services.app.uiCustomizationSettings;

    $("input[name='AllowAsideHiding'], input[name='AllowAsideMinimizing']").change(function () {
      var $closestForm = $(this).closest('form');
      toggleLeftMenuHideMode($closestForm);
    });

    function toggleLeftMenuHideMode($closestForm) {
      var allowAsideMinimizing = $closestForm.find("input[name='AllowAsideMinimizing']").is(':checked');

      if (allowAsideMinimizing) {
        $closestForm.find("input[name='DefaultMinimizedAside']").removeAttr('disabled');

        $closestForm.find("input[name='AllowAsideHiding']").prop('checked', false);
        $closestForm.find("input[name='AllowAsideHiding']").attr('disabled', 'disabled');

        $closestForm.find("input[name='DefaultHiddenAside']").prop('checked', false);
        $closestForm.find("input[name='DefaultHiddenAside']").attr('disabled', 'disabled');
      } else {
        $closestForm.find("input[name='AllowAsideHiding']").removeAttr('disabled');
        $closestForm.find("input[name='DefaultHiddenAside']").removeAttr('disabled');

        $closestForm.find("input[name='DefaultMinimizedAside']").prop('checked', false);
        $closestForm.find("input[name='DefaultMinimizedAside']").attr('disabled', 'disabled');
      }

      var allowAsideHiding = $closestForm.find("input[name='AllowAsideHiding']").is(':checked');

      if (allowAsideHiding) {
        $closestForm.find("input[name='DefaultHiddenAside']").removeAttr('disabled');
      } else {
        $closestForm.find("input[name='DefaultHiddenAside']").prop('checked', false);
        $closestForm.find("input[name='DefaultHiddenAside']").attr('disabled', 'disabled');
      }
    }

    toggleLeftMenuHideMode($('#DefaultMenu').find('form'));
    toggleLeftMenuHideMode($('#Theme12Menu').find('form'));

    $('#SaveSettingsButton').click(function () {
      var activeThemeTab = $('#metronicThemes').find('.tab-pane.theme-selection.active')[0];
      _uiCustomizationSettingsService
        .updateUiManagementSettings({
          theme: $(activeThemeTab).find('input[name="Theme"]').val(),
          layout: $(activeThemeTab).find('.LayoutSettingsForm').serializeFormToObject(),
          header: $(activeThemeTab).find('.HeaderSettingsForm').serializeFormToObject(),
          subHeader: $(activeThemeTab).find('.SubHeaderSettingsForm').serializeFormToObject(),
          menu: $(activeThemeTab).find('.MenuSettingsForm').serializeFormToObject(),
          footer: $(activeThemeTab).find('.FooterSettingsForm').serializeFormToObject(),
        })
        .done(function () {
          window.location.reload();
        });
    });

    $('#SaveDefaultSettingsButton').click(function () {
      var activeThemeTab = $('#metronicThemes').find('.tab-pane.theme-selection.active')[0];
      _uiCustomizationSettingsService
        .updateDefaultUiManagementSettings({
          theme: $(activeThemeTab).find('input[name="Theme"]').val(),
          layout: $(activeThemeTab).find('.LayoutSettingsForm').serializeFormToObject(),
          header: $(activeThemeTab).find('.HeaderSettingsForm').serializeFormToObject(),
          subHeader: $(activeThemeTab).find('.SubHeaderSettingsForm').serializeFormToObject(),
          menu: $(activeThemeTab).find('.MenuSettingsForm').serializeFormToObject(),
          footer: $(activeThemeTab).find('.FooterSettingsForm').serializeFormToObject(),
        })
        .done(function () {
          window.location.reload();
        });
    });

    $('#UseSystemDefaultSettings').click(function () {
      _uiCustomizationSettingsService.useSystemDefaultSettings().done(function () {
        window.location.reload();
      });
    });
  });
})(jQuery);
