
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
    'esri/Map',
    'esri/Graphic',
    'esri/Color',
    'esri/Basemap',

    'esri/core/watchUtils',
    'esri/core/accessorSupport/decorators',
    'esri/core/Accessor',
    'esri/core/Evented',

    'esri/views/MapView',
    'esri/views/SceneView',

    'esri/layers/GraphicsLayer',

    'esri/geometry/Point',
    'esri/geometry/ScreenPoint',
    'esri/geometry/Polygon',
    'esri/geometry/Polyline',
    'esri/geometry/Multipoint',
    'esri/geometry/Circle',
    'esri/geometry/geometryEngine',
    'esri/geometry/support/webMercatorUtils',

    'esri/symbols/SimpleMarkerSymbol',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',

    'esri/widgets/Compass',
    'esri/widgets/Zoom'

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



