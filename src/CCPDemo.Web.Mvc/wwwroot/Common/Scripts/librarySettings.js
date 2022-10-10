(function () {
  //Set Moment Timezone
  if (abp.clock.provider.supportsMultipleTimezone && window.moment) {
    moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
  }

  //Localize Sweet Alert
  if (abp.libs.sweetAlert) {
    abp.libs.sweetAlert.config.info.button = app.localize('Ok');
    abp.libs.sweetAlert.config.success.button = app.localize('Ok');
    abp.libs.sweetAlert.config.warn.button = app.localize('Ok');
    abp.libs.sweetAlert.config.error.button = app.localize('Ok');

    abp.libs.sweetAlert.config.confirm.buttons = [app.localize('Cancel'), app.localize('Yes')];
  }
})();
