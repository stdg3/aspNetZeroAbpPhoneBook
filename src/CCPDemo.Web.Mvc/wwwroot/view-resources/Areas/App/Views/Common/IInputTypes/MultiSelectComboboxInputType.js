var MultiSelectComboBoxInputType = (function () {
  return function () {
    var _options;
    function init(inputTypeInfo, options) {
      _options = options;
    }

    var $combobox;
    function getView(selectedValues, allItems) {
      $combobox = $('<select class="form-select w-100" multiple/>');

      if (allItems && allItems.length > 0) {
        for (var i = 0; i < allItems.length; i++) {
          var $option = $('<option></option>').attr('value', allItems[i]).text(allItems[i]);

          if (selectedValues && selectedValues.length > 0 && selectedValues.indexOf(allItems[i]) !== -1) {
            $option.attr('selected', 'selected');
          }

          $option.appendTo($combobox);
        }
      }

      $combobox.on('change', function () {
        if (_options && typeof _options.onChange === 'function') {
          _options.onChange($combobox.val());
        }
      });
      return $combobox[0];
    }

    function getSelectedValues() {
      return $combobox.val();
    }

    function afterViewInitialized() {
      $combobox.select2({ width: '100%' });
    }

    return {
      name: 'MULTISELECTCOMBOBOX',
      init: init,
      getSelectedValues: getSelectedValues,
      getView: getView,
      hasValues: true, //is that input type need values to work. For example dropdown need values to select.
      afterViewInitialized: afterViewInitialized,
    };
  };
})();

(function () {
  var MultiSelectComboBoxInputTypeProvider = new (function () {
    this.name = 'MULTISELECTCOMBOBOX';
    this.get = function () {
      return new MultiSelectComboBoxInputType();
    };
  })();

  abp.inputTypeProviders.addInputTypeProvider(MultiSelectComboBoxInputTypeProvider);
})();
