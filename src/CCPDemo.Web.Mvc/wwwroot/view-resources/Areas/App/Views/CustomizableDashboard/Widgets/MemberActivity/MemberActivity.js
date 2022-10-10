(function () {
  app.widgets.Widgets_Tenant_MemberActivity = function () {
    var _tenantDashboardService = abp.services.app.tenantDashboard;
    var _widget;

    this.init = function (widgetManager) {
      _widget = widgetManager.getWidget();
      initMemberActivity();
    };

    var initMemberActivity = function () {
      var refreshMemberActivity = function () {
        _tenantDashboardService.getMemberActivity({}).done(function (result) {
          _widget.find('#memberActivityTable tbody>tr').each(function (index) {
            var cells = $(this).find('td');
            var $link = $('<a/>')
              .attr('href', 'javascript:;')
              .addClass('primary-link')
              .text(result.memberActivities[index].name);

            $(cells[1]).empty().append($link);
            $(cells[2]).html(result.memberActivities[index].cases);
            $(cells[3]).html(result.memberActivities[index].closed);
            $(cells[4]).html(result.memberActivities[index].rate);
            $(cells[5]).html(result.memberActivities[index].rate);
            $(cells[6]).html(result.memberActivities[index].earnings);
          });
        });
      };

      _widget.find('.refreshMemberActivityButton').click(function () {
        refreshMemberActivity();
      });

      refreshMemberActivity();
    };
  };
})();
