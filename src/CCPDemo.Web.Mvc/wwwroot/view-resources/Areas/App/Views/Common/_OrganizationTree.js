var OrganizationTree = (function ($) {
  return function () {
    var $tree;
    var $defaultOptions = {
      cascadeSelectEnabled: true,
    };

    function initFiltering() {
      var to = false;
      $('#OrganizationTreeFilter').keyup(function () {
        if (to) {
          clearTimeout(to);
        }
        to = setTimeout(function () {
          var v = $('#OrganizationTreeFilter').val();
          $tree.jstree(true).search(v);
        }, 250);
      });
    }

    function init($treeContainer, $options) {
      $options = $.extend($defaultOptions, $options);

      $tree = $treeContainer;
      $tree.jstree({
        types: {
          default: {
            icon: 'fa fa-folder text-warning',
          },
          file: {
            icon: 'fa fa-file text-warning',
          },
        },
        checkbox: {
          keep_selected_style: false,
          three_state: false,
          cascade: '',
        },
        search: {
          show_only_matches: true,
        },
        plugins: ['checkbox', 'types', 'search'],
      });

      $tree.on('changed.jstree', function (e, data) {
        if (!$options.cascadeSelectEnabled) {
          return;
        }

        if (!data.node) {
          return;
        }

        var childrenNodes;

        if (data.node.state.selected) {
          selectNodeAndAllParents($tree.jstree('get_parent', data.node));

          childrenNodes = $.makeArray($tree.jstree('get_node', data.node).children);
          $tree.jstree('select_node', childrenNodes);
        } else {
          childrenNodes = $.makeArray($tree.jstree('get_node', data.node).children);
          $tree.jstree('deselect_node', childrenNodes);
        }
      });

      initFiltering();
    }

    function selectNodeAndAllParents(node) {
      $tree.jstree('select_node', node, true);
      var parent = $tree.jstree('get_parent', node);
      if (parent) {
        selectNodeAndAllParents(parent);
      }
    }

    function getSelectedOrganizations() {
      var organizationIds = [];

      var selectedOrganizations = $tree.jstree('get_selected', true);
      for (var i = 0; i < selectedOrganizations.length; i++) {
        organizationIds.push(selectedOrganizations[i].id);
      }

      return organizationIds;
    }

    return {
      init: init,
      getSelectedOrganizations: getSelectedOrganizations,
    };
  };
})(jQuery);
