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
    'esri/views/MapView',
    'esri/layers/GraphicsLayer',
    'esri/geometry/Point',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/Graphic',
    'esri/Color',
    'esri/core/accessorSupport/decorators'
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