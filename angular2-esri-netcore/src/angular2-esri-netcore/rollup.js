import rollup      from 'rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs    from 'rollup-plugin-commonjs';
import uglify      from 'rollup-plugin-uglify';
import angular     from 'rollup-plugin-angular';

export default {
entry: 'wwwroot/app/main.aot.js',
dest: 'wwwroot/dist/build.js', // output a single application bundle
external: [
    //decalre all of the esri modules included as external references. Should have this array declared once and shared between load.ts and this file.
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

    'esri/symbols/SimpleMarkerSymbol',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',

    'esri/widgets/Compass',
    'esri/widgets/Zoom'
],
sourceMap: false,
format: 'amd',
plugins: [
    nodeResolve(
        { 
            jsnext: true, 
            module: true
        }),
    commonjs({
        include: 'node_modules/rxjs/**'
    }),
    uglify()
]
}