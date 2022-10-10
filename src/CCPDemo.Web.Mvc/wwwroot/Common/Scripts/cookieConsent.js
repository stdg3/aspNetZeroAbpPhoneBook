window.addEventListener('load', function () {
  if (abp.setting.getBoolean('App.UserManagement.IsCookieConsentEnabled')) {
    window.cookieconsent.initialise({
      showLink: false,
      content: {
        message: app.localize('CookieConsent_Message'),
        dismiss: app.localize('CookieConsent_Dismiss'),
      },
    });
  }
});
