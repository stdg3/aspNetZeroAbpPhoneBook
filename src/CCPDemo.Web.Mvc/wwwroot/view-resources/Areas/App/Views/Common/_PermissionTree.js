var PermissionsTree = (function ($) {
  return function () {
    var $tree;

    function initFiltering() {
      var to = false;
      $('#PermissionTreeFilter').keyup(function () {
        if (to) {
          clearTimeout(to);
        }
        to = setTimeout(function () {
          var v = $('#PermissionTreeFilter').val();
          if ($tree.jstree(true)) {
            $tree.jstree(true).search(v);
          }
        }, 250);
      });
    }

    function init($treeContainer, options) {
      $tree = $treeContainer;
      initialized = false;
      var _jsTreeOptions = {
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
      };

      if (options) {
        if (options.singleSelect && options.singleSelect === true) {
          $.extend(_jsTreeOptions, {
            core: {
              multiple: false,
            },
          });
        }
      }

      $tree.jstree(_jsTreeOptions);
      if (
        !(
          options &&
          ((options.singleSelect && options.singleSelect === true) ||
            (options.disableCascade && options.disableCascade === true))
        )
      ) {
        $tree.on('changed.jstree', function (e, data) {
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
      }

      initFiltering();
    }

    function selectNodeAndAllParents(node) {
      $tree.jstree('select_node', node, true);
      var parent = $tree.jstree('get_parent', node);
      if (parent) {
        selectNodeAndAllParents(parent);
      }
    }

    function getSelectedPermissionNames() {
      var permissionNames = [];

      var selectedPermissions = $tree.jstree('get_selected', true);
      for (var i = 0; i < selectedPermissions.length; i++) {
        permissionNames.push(selectedPermissions[i].id);
      }

      return permissionNames;
    }

    return {
      init: init,
      getSelectedPermissionNames: getSelectedPermissionNames,
    };
  };
})(jQuery);
