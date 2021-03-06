/**
 * Application entry point.
 *
 * This file defines the "app_mobile" Closure namespace, which is be used as the
 * Closure entry point (see "closure_entry_point" in the "build.json" file).
 *
 * This file includes `goog.require`'s for all the components/directives used
 * by the HTML page and the controller to provide the configuration.
 */
goog.provide('app.MobileController');
goog.provide('app_mobile');

goog.require('app');
goog.require('gmf.AbstractMobileController');
/** @suppress {extraRequire} */
goog.require('gmf.authenticationDirective');
/** @suppress {extraRequire} */
goog.require('gmf.proj.EPSG21781');
/** @suppress {extraRequire} */
goog.require('ngeo.mobileGeolocationDirective');

/* global app */

app.module.constant('ngeoQueryOptions', {
  'limit': 20
});


/**
 * @param {angular.Scope} $scope Scope.
 * @param {angular.$injector} $injector Main injector.
 * @constructor
 * @extends {gmf.AbstractMobileController}
 * @ngInject
 * @export
 */
app.MobileController = function($scope, $injector) {
  goog.base(
      this, {
        srid: 21781,
        mapViewConfig: {
          center: [632464, 185457],
          minZoom: 3,
          zoom: 3
        }
      },
      $scope, $injector);
};
goog.inherits(app.MobileController, gmf.AbstractMobileController);


app.module.controller('MobileController', app.MobileController);
