var CheckBoxInputType = (function () {
  return function () {
    var _options;
    function init(inputTypeInfo, options) {
      _options = options;
    }

    var $checkbox;
    function getView(selectedValues, allItems) {
      $div = $('<div class="form-group checkbox-list">');
      $label = $('<label class="checkbox">').appendTo($div);
      $checkbox = $('<input type="checkbox"/>').appendTo($label);
      $span = $('<span></span>').appendTo($label);
      $checkbox.on('change', function () {
        if (_options && typeof _options.onChange === 'function') {
          _options.onChange($checkbox.val());
        }
      });

      if (selectedValues && selectedValues.length > 0) {
        $checkbox.prop('checked', selectedValues[0]);
      }
      return $div[0];
    }

    function getSelectedValues() {
      return [$checkbox.prop('checked')];
    }

    /*
         * {
                name: "",//unique name of InputType (string)
                init: init,//initialize function
                getSelectedValues: getSelectedValues,//function that returns selected value(s) for returned view (returns list of string)
                getView: getView,//function that returns html view for input type (gets parameter named selectedValues)
                hasValues: false //is that input type need values to work. For example dropdown need values to select.
            }
         */

    function afterViewInitialized() {}

    return {
      name: 'CHECKBOX',
      init: init,
      getSelectedValues: getSelectedValues,
      getView: getView,
      hasValues: false, //is that input type need values to work. For example dropdown need values to select.
      afterViewInitialized: afterViewInitialized,
    };
  };
})();

(function () {
  var CheckBoxInputTypeProvider = new (function () {
    this.name = 'CHECKBOX';
    this.get = function () {
      return new CheckBoxInputType();
    };
  })();

  abp.inputTypeProviders.addInputTypeProvider(CheckBoxInputTypeProvider);
})();
