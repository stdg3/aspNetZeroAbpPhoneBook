$(function () {
  var $container = $('.menu');
  var $selectMenu = $('.searchMenuSelect2');

  function initializeMenuItems() {
    var allMenuElements = $container.find('.menu-item');
    var data = [];
    _.forEach(allMenuElements, function (menuItem) {
      if (!$(menuItem).hasClass('menuSearchItem')) {
        var linkElement = $(menuItem).find('.menu-link');
        if (linkElement) {
          var href = linkElement.attr('href');
          if (href && href !== '#' && href !== 'javascript:;') {
            var textElement = $(menuItem).find('.menu-title');
            if (textElement) {
              var iconElement = $(menuItem).find('i.menu-link-icon');
              if (iconElement) {
                data.push({
                  id: href.trim(),
                  text: $(textElement).text().trim(),
                  icon: iconElement.attr('class'),
                });
              } else {
                data.push({
                  id: href.trim(),
                  text: $(textElement).text().trim(),
                });
              }
            }
          }
        }
      }
    });

    function format(item) {
      if (item.icon) {
        return '<i class="' + item.icon + '"></i>' + item.text;
      } else {
        return item.text;
      }
    }

    var placeHolder = app.localize('QuickNav');

    $selectMenu.select2({
      placeholder: placeHolder,
      minimumInputLength: 2,
      language: abp.localization.currentCulture.name,
      data: data,
      formatSelection: format,
      formatResult: format,
    });
  }

  initializeMenuItems();

  $selectMenu.on('select2:open', function () {
    $selectMenu.data('select2').$dropdown.addClass('searchMenuDropDownSelect2');
  });

  $selectMenu.on('change', function () {
    var val = $(this).val();
    if (val) {
      window.location.href = val;
    }
  });
});
