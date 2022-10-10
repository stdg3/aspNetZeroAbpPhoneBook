(function () {
  $(function () {
    var _manageDynamicEntityPropertyValueBase = new ManageDynamicEntityPropertyValueBase();

    function initializePage() {
      _manageDynamicEntityPropertyValueBase.initialize({
        entityFullName: $('#EntityFullName').val(),
        entityId: $('#EntityId').val(),
        bodyElement: $('#DynamicEntityPropertyValuesTable').find('tbody'),
        onDeleteValues: function () {
          setTimeout(function () {
            window.location.reload();
          }, 500);
        },
      });
    }

    function saveProperties() {
      _manageDynamicEntityPropertyValueBase.save();
    }

    $('#saveProperties').click(saveProperties);

    initializePage();
  });
})();
