goog.provide('ngeo.PrintUtils');

goog.require('ngeo');


/**
 * Provides a service with print utility functions.
 *
 * @constructor
 * @ngdoc service
 * @ngname ngeoPrintUtils
 */
ngeo.PrintUtils = function() {
};


/**
 * @const
 * @private
 */
ngeo.PrintUtils.INCHES_PER_METER_ = 39.37;


/**
 * @const
 * @private
 */
ngeo.PrintUtils.DOTS_PER_INCH_ = 72;


/**
 * Return a function to use as map postcompose listener for drawing a print
 * mask on the map.
 * @param {function():ol.Size} getSize User-defined function returning the
 * size in dots of the map to print.
 * @param {function(olx.FrameState):number} getScale User-defined function
 * returning the scale of the map to print.
 * @return {function(ol.render.Event)} Function to use as a map postcompose
 * listener.
 */
ngeo.PrintUtils.prototype.createPrintMaskPostcompose = function(getSize, getScale) {

  return (
      /**
       * @param {ol.render.Event} evt Postcompose event.
       */
      function(evt) {
        var context = evt.context;
        var frameState = evt.frameState;

        var resolution = frameState.viewState.resolution;

        var viewportWidth = frameState.size[0] * frameState.pixelRatio;
        var viewportHeight = frameState.size[1] * frameState.pixelRatio;

        var centerX = viewportWidth / 2;
        var centerY = viewportHeight / 2;

        var size = getSize();
        var scale = getScale(frameState);

        var ppi = ngeo.PrintUtils.DOTS_PER_INCH_;
        var ipm = ngeo.PrintUtils.INCHES_PER_METER_;

        var extentHalfWidth =
            (((size[0] / ppi) / ipm) * scale / resolution) / 2;

        var extentHalfHeight =
            (((size[1] / ppi) / ipm) * scale / resolution) / 2;

        var minx = centerX - extentHalfWidth;
        var miny = centerY - extentHalfHeight;
        var maxx = centerX + extentHalfWidth;
        var maxy = centerY + extentHalfHeight;

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(viewportWidth, 0);
        context.lineTo(viewportWidth, viewportHeight);
        context.lineTo(0, viewportHeight);
        context.lineTo(0, 0);
        context.closePath();

        context.moveTo(minx, miny);
        context.lineTo(minx, maxy);
        context.lineTo(maxx, maxy);
        context.lineTo(maxx, miny);
        context.lineTo(minx, miny);
        context.closePath();

        context.fillStyle = 'rgba(0, 5, 25, 0.5)';
        context.fill();
      });
};


/**
 * Get the optimal print scale for a map, the map being defined by its
 * size (in pixels) and resolution (in map units per pixel).
 * @param {ol.Size} mapSize Size of the map on the screen (px).
 * @param {number} mapResolution Resolution of the map on the screen.
 * @param {ol.Size} printMapSize Size of the map on the paper (dots).
 * @param {Array.<number>} printMapScales Supported map scales on the paper.
 * The scales are provided as scale denominators, sorted in ascending order.
 * E.g. `[500, 1000, 2000, 4000]`.
 * @return {number} The best scale. `-1` is returned if there is no optimal
 * scale, that is the optimal scale is lower than or equal to the first value
 * in `printMapScales`.
 */
ngeo.PrintUtils.prototype.getOptimalScale = function(
    mapSize, mapResolution, printMapSize, printMapScales) {

  var mapWidth = mapSize[0] * mapResolution;
  var mapHeight = mapSize[1] * mapResolution;

  var scaleWidth = mapWidth * ngeo.PrintUtils.INCHES_PER_METER_ *
      ngeo.PrintUtils.DOTS_PER_INCH_ / printMapSize[0];
  var scaleHeight = mapHeight * ngeo.PrintUtils.INCHES_PER_METER_ *
      ngeo.PrintUtils.DOTS_PER_INCH_ / printMapSize[1];

  var scale = Math.min(scaleWidth, scaleHeight);

  var optimal = -1;
  for (var i = 0, ii = printMapScales.length; i < ii; ++i) {
    if (scale > printMapScales[i]) {
      optimal = printMapScales[i];
    }
  }

  return optimal;
};


/**
 * Get the optimal map resolution for a print scale and a map size.
 * @param {ol.Size} mapSize Size of the map on the screen (px).
 * @param {ol.Size} printMapSize Size of the map on the paper (dots).
 * @param {number} printMapScale Map scale on the paper.
 * @return {number} The optimal map resolution.
 */
ngeo.PrintUtils.prototype.getOptimalResolution = function(
    mapSize, printMapSize, printMapScale) {

  var dotsPerMeter =
      ngeo.PrintUtils.DOTS_PER_INCH_ * ngeo.PrintUtils.INCHES_PER_METER_;

  var resolutionX = (printMapSize[0] * printMapScale) /
      (dotsPerMeter * mapSize[0]);
  var resolutionY = (printMapSize[1] * printMapScale) /
      (dotsPerMeter * mapSize[1]);

  var optimalResolution = Math.max(resolutionX, resolutionY);

  return optimalResolution;
};


ngeo.module.service('ngeoPrintUtils', ngeo.PrintUtils);
