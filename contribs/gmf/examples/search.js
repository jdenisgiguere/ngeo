goog.provide('gmf-search');

goog.require('gmf.mapDirective');
goog.require('gmf.searchDirective');
goog.require('ngeo.FeatureOverlayMgr');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.layer.Tile');
goog.require('ol.source.OSM');


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['gmf']);

app.module.constant('gmfTreeUrl', 'data/themes.json');


/**
 * @param {ngeo.FeatureOverlayMgr} ngeoFeatureOverlayMgr The ngeo feature
 *     overlay manager service.
 * @param {gmf.Themes} gmfThemes Themes service.
 * @constructor
 * @ngInject
 */
app.MainController = function(ngeoFeatureOverlayMgr, gmfThemes) {

  gmfThemes.loadThemes();

  proj4.defs('EPSG:21781',
      '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 ' +
      '+x_0=600000 +y_0=200000 +ellps=bessel ' +
      '+towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs');

  /**
   * @type {Array.<gmfx.SearchDirectiveDatasource>}
   * @export
   */
  this.searchDatasources = [{
    labelKey: 'label',
    projection: 'EPSG:21781',
    url: 'https://geomapfish-demo.camptocamp.net/2.0/wsgi/fulltextsearch'
  }];

  /**
   * @type {ol.Map}
   * @export
   */
  this.map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: [0, 0],
      zoom: 4
    })
  });

  ngeoFeatureOverlayMgr.init(this.map);
};


app.module.controller('MainController', app.MainController);
