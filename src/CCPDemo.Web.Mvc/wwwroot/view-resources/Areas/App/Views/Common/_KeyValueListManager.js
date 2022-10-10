var KeyValueListManager = (function ($) {
  return function () {
    let _args;
    let _keyValueItems = [];
    let _$keyInput;
    let _$valueInput;
    let _$addBtn;

    function init(args) {
      _args = args;

      for (let i = 0; i < _args.items.length; i++) {
        _keyValueItems.push(_args.items[i]);
      }

      let view = getInitialView();
      $('#' + args.containerId).append(view);

      _$keyInput = $(`#${_args.name}-key`);
      _$valueInput = $(`#${_args.name}-value`);
      _$addBtn = $(`#${_args.name}-add-btn`);
      bindActions();
    }

    function removeFromList(key) {
      _keyValueItems = _keyValueItems.filter(function (item) {
        return item.key !== key;
      });
      refreshListView();
      manageEditMode(_$keyInput.val());
    }

    function getItemFromList(key) {
      for (let i = 0; i < _keyValueItems.length; i++) {
        if (_keyValueItems[i].key === key) {
          return {
            index: i,
            data: _keyValueItems[i],
          };
        }
      }

      return null;
    }

    function getInitialView() {
      let keyNameLocalized = app.localize('Key');
      let valueNameLocalized = app.localize('Value');

      if (_args.keyName) {
        keyNameLocalized = app.localize(_args.keyName);
      }

      if (_args.valueName) {
        valueNameLocalized = app.localize(_args.valueName);
      }

      let view = `
                 <div class="form-group mb-2">
                         <div class="input-group">
                             <input type="text" class="form-control" id="${
                               _args.name
                             }-key" placeholder="${keyNameLocalized}">
                             <input type="text" class="form-control" id="${
                               _args.name
                             }-value" placeholder="${valueNameLocalized}">
                             <button id="${
                                _args.name
                            }-add-btn" class="btn btn-primary" type="button">${app.localize('Add')}</button>
                         </div>
                </div>`;

      view += `<div class="key-value-items-list" id="${_args.name}-list">`;
      view += getListItemViewsOfKeyValueItems();
      view += '</div>';

      return view;
    }

    function getListItemViewsOfKeyValueItems() {
      let view = '';
      if (_keyValueItems && _keyValueItems.length > 0) {
        for (var i = 0; i < _keyValueItems.length; i++) {
          view += getListItemView(_keyValueItems[i], i);
        }
      }
      return view;
    }

    function refreshListView() {
      var view = getListItemViewsOfKeyValueItems();
      $(`#${_args.name}-list`).html(view);
    }

    function getListItemView(item, index) {
      return `
                <div class="alert alert-custom alert-white alert-dismissible alert-bold m-1" id="${_args.name}-item-${index}" data-index="${index}" role="alert">
                   "${item.key}" : "${item.value}"                       
                     <button type="button" class="btn btn-primary btn-sm m-0 p-3 editBtn">
                         <i class="la la-edit fa-1x m-0 p-0"></i>
                     </button>
                      <button type="button" class="btn btn-danger btn-sm m-0 p-3 closeBtn" data-bs-dismiss="alert" aria-label="Close">
                         <i class="la la-close fa-1x m-0 p-0"></i>
                     </button>
                </div> 
            `;
    }

    function bindActions() {
      let btnDelete = `#${_args.name}-list .closeBtn`;
      $(document).on('click', btnDelete, function () {
        let parent = $(this).closest('.alert');
        let index = parent.attr('data-index');
        let item = _keyValueItems[index];
        if (item !== null) {
          removeFromList(item.key);
        }
        refreshListView();
      });

      let btnEdit = `#${_args.name}-list .editBtn`;
      $(document).on('click', btnEdit, function () {
        let parent = $(this).closest('.alert');
        let index = parent.attr('data-index');
        let item = _keyValueItems[index];
        if (item !== null) {
          manageEditMode(item.key);
        }
      });

      _$addBtn.click(function () {
        addNewKeyValue();
      });

      _$keyInput.change(function () {
        manageEditMode($(this).val());
      });
    }

    function manageEditMode(key) {
      let item = getItemFromList(key);
      clearListItemViews();

      if (item) {
        _$keyInput.val(item.data.key);
        _$valueInput.val(item.data.value);
        $(`#${_args.name}-add-btn`).html(app.localize('Edit'));

        $(`#${_args.name}-item-${item.index}`).removeClass('alert-white').addClass('alert-warning');
      } else {
        $(`#${_args.name}-add-btn`).html(app.localize('Add'));
      }
    }

    function clearListItemViews() {
      var items = $(`#${_args.name}-list .alert`);
      for (let i = 0; i < items.length; i++) {
        $(items[i]).removeClass('alert-warning').addClass('alert-white');
      }
    }

    function addNewKeyValue() {
      let key = _$keyInput.val();
      let value = _$valueInput.val();

      if (!key || key === '' || !value || value === '') {
        abp.notify.error(app.localize('KeyAndValueCanNotBeNull'));
        return;
      }

      let item = getItemFromList(key);
      if (item) {
        removeFromList(key);
      }

      _keyValueItems.push({
        key: key,
        value: value,
      });

      refreshListView();

      _$keyInput.val('');
      _$valueInput.val('');
    }

    function getValues() {
      return _keyValueItems;
    }

    return {
      init: init,
      getValues: getValues,
    };
  };
})(jQuery);
