
//This file basically bootstraps the ESRI ArcGIS api to work using system.js.
//All ArcGIS modules required should be added to the deps array. 

declare var System: any;
declare var __moduleName: string; //this is so we can use relative paths to templates and styles within components. Only required if using SystemJS module.
declare var module: any; //this is so we can use relative paths to tempaltes and styles within components. Only required if using commonjs module.

declare var esriSystem: any; //ambient declaration for esriSystem.
 
//declare aliases for paths
let paths = {
    "lib:": "lib/"
}

let map = {

    app: 'app', // 'custom dist',
    // angular bundles
    '@angular/core': 'lib:@angular/core/bundles/core.umd.js',
    '@angular/common': 'lib:@angular/common/bundles/common.umd.js',
    '@angular/compiler': 'lib:@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser': 'lib:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'lib:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'lib:@angular/http/bundles/http.umd.js',
    '@angular/router': 'lib:@angular/router/bundles/router.umd.js',
    '@angular/forms': 'lib:@angular/forms/bundles/forms.umd.js',

    // other libraries
    'rxjs': 'lib:rxjs',
    'angular-in-memory-web-api': 'lib:angular-in-memory-web-api',
      
}  
 
let packages = {
    app: {
        main: './main.js',
        defaultExtension: 'js'
    },
    rxjs: {
        defaultExtension: 'js'
    },
    'angular-in-memory-web-api': {
        main: './index.js',
        defaultExtension: 'js'
    }
}
     
// configure SystemJS
System.config({
    paths: paths,
    map: map,
    packages: packages
});


//use esri-system-js to load the esri modules, then kick off loading the app package defined in SystemJS.
esriSystem.register([
    "esri/Map",
    "esri/config",
    "esri/Color",
    "esri/Graphic",
    "esri/Basemap",
    "esri/PopupTemplate",
    "esri/request",
    "esri/Ground",

    "esri/views/MapView",
    "esri/views/SceneView",

    "esri/core/Accessor",
    "esri/core/watchUtils",
    "esri/core/urlUtils",
    "esri/core/Collection",
    "esri/core/Evented",
    "esri/core/accessorSupport/decorators",

    "esri/geometry/Extent",
    "esri/geometry/Point",
    "esri/geometry/ScreenPoint",
    "esri/geometry/Polygon",
    "esri/geometry/Circle",
    "esri/geometry/Polyline",
    "esri/geometry/Multipoint",
    "esri/geometry/geometryEngine",
    "esri/geometry/SpatialReference",
    "esri/geometry/support/webMercatorUtils",

    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/TextSymbol",
    "esri/symbols/PointSymbol3D",
    "esri/symbols/ObjectSymbol3DLayer",

    "esri/renderers/Renderer",
    "esri/renderers/SimpleRenderer",
    "esri/renderers/UniqueValueRenderer",
    "esri/renderers/ClassBreaksRenderer",

    "esri/layers/Layer",
    "esri/layers/GraphicsLayer",
    "esri/layers/MapImageLayer",
    "esri/layers/WebTileLayer",
    "esri/layers/ImageryLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/ElevationLayer",

    "esri/layers/support/Field",

    "esri/widgets/Popup",
    "esri/widgets/Popup/PopupViewModel",
    "esri/widgets/Compass",
    "esri/widgets/Zoom",
    "esri/widgets/Print",
    "esri/widgets/ScaleBar",

    "esri/views/View",
    "esri/config",

    "dojo/_base/lang",
    "dojo/query",
    "dojo/on",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/Deferred",
    "dojo/fx",
    "dojox/gfx",
    "dojo/sniff"

], 
    function () {
        // bootstrap the app
        System.import('app')
            .catch(function (err: any) {
                console.error('%O%', err);
            });
    }, {
        maintainModuleNames: true
    });



