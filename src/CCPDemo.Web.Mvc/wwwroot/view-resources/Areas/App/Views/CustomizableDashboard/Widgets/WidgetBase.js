(function () {
  app.widgetBase = (function () {
    return function () {
      let delay = 300;
      let timer;

      var _runDelayed = function (callBack) {
        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(function () {
          callBack();
        }, delay);
      };
      return {
        runDelayed: _runDelayed,
      };
    };
  })();

  app.widgetBase.create = function () {
    return new app.widgetBase();
  };
})();
