/**
 * @fileoverview Provides a directive that can be used to change the order of
 * items in an array.
 * It can be used to change the order of layers in the map for example.
 * It requires JQuery-UI Sortable.
 *
 * Example:
 *
 * <ul ngeo-sortable="ctrl.map.getLayers().getArray()">
 *   <li ng-repeat="ctrl.map.getLayers().getArray()">
 *      <span class="handle"></span>{{layer.get('name')}}
 *   </li>
 * </ul>
 */

goog.provide('ngeo.sortableDirective');

goog.require('goog.asserts');
goog.require('ngeo');


/**
 * @param {angular.$timeout} $timeout Angular timeout service.
 * @return {angular.Directive} The directive specs.
 * @ngInject
 */
ngeo.sortableDirective = function($timeout) {
  return {
    restrict: 'A',
    scope: true,
    link:
        /**
         * @param {angular.Scope} scope Scope.
         * @param {angular.JQLite} element Element.
         * @param {angular.Attributes} attrs Attributes.
         */
        function(scope, element, attrs) {
          var sortableExpr = attrs['ngeoSortable'];

          var sortable = /** @type {Array.<ol.layer.Base>} */
              (scope.$eval(sortableExpr));

          goog.asserts.assert(goog.isDef(angular.element.fn) &&
              goog.isDef(angular.element.fn.jquery), 'jQuery is required');

          element.sortable();

          /**
           * @type {number}
           */
          var startIndex = -1;

          // ui.item comes from JQuery sortable plugin

          element.sortable('option', 'start',
              /**
               * @param {jQuery.event} e jQuery Event.
               * @param {jQueryUI} ui jQuery UI object.
               */
              function(e, ui) {
                // save the starting position of dragged item
                startIndex = ui.item.index();
              });

          element.sortable('option', 'update',
              /**
               * @param {jQuery.event} e jQuery Event.
               * @param {jQueryUI} ui jQuery UI object.
               */
              function(e, ui) {
                goog.asserts.assert(startIndex != -1);
                scope.$apply(function() {
                  sortable.splice(
                      ui.item.index(), 0,
                      sortable.splice(startIndex, 1)[0]);
                });
                startIndex = -1;
              });

          element.sortable('option', 'handle', '.handle');
          element.sortable('option', 'containment', 'parent');
          element.sortable('option', 'opacity', 0.5);
          element.sortable('option', 'cursor', 'move');
        }
  };
};

ngeoModule.directive('ngeoSortable', ngeo.sortableDirective);