var app = app || {};
(function ($) {
  app.widgets = app.widgets || {};

  app.WidgetManager = (function () {
    function _clearContainer(widgetSelector) {
      var $container = $(widgetSelector);
      if ($container.length) {
        $container.empty();
      }
    }

    return function (options) {
      var _options = options;
      var _$widgetContainer = null;
      var _widgetContainerSelector = '#' + options.containerId;
      var _widgetObject = null;

      var _publicApi = null;
      var _args = null;

      var _initted = false;

      function initAndShowWidget() {
        if (_initted) {
          return;
        }
        _initted = true;

        _$widgetContainer = $(_widgetContainerSelector);

        _clearContainer(_widgetContainerSelector);

        _$widgetContainer.load(options.viewUrl, _args, function (response, status, xhr) {
          if (status === 'error') {
            abp.message.warn(abp.localization.abpWeb('InternalServerError'));
            return;
          }

          if (options.scriptUrl) {
            app.ResourceLoader.loadScript(options.scriptUrl, function () {
              let widgetClass = app.widgets[options.widgetClass];
              if (widgetClass) {
                _widgetObject = new widgetClass();
                if (_widgetObject.init) {
                  _widgetObject.init(_publicApi);
                }
              }
            });
          } else {
          }
        });
      }

      function initialize() {
        let closestPage = $('#' + options.containerId).closest('.tab-pane');
        if (closestPage.hasClass('active')) {
          //if the widget is in active tab, load it immediately
          initAndShowWidget();
        } else {
          //otherwise wait for the tab to be active for the widget to load
          var closesPagesId = closestPage.attr('id');

          $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
            var target = $(e.target).attr('href');
            if (target === '#' + closesPagesId) {
              //if widget's page is activated, load widget
              initAndShowWidget();
            }
          });
        }
      }

      _publicApi = {
        getWidgetContainerId: function () {
          return _options.containerId;
        },

        getWidget: function () {
          return _$widgetContainer;
        },

        getOptions: function () {
          return _options;
        },

        getWidgetObject: function () {
          return _widgetObject;
        },
      };

      initialize();

      return _publicApi;
    };
  })();
})(jQuery);
