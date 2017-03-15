import rollup      from 'rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs    from 'rollup-plugin-commonjs';
import uglify      from 'rollup-plugin-uglify';
//import angular     from 'rollup-plugin-angular';

var esriModuleList = ["esri", "dojo", "dojox"];

export default {
entry: 'wwwroot/app/main.aot.js',
dest: 'wwwroot/dist/build.js', // output a single application bundle
sourceMap: false,
format: 'amd',
useStrict: false, // arcgis 4.3 is throwing an error on IOS if "use strict" is outputted. Don't do it for now. May be able to reenable it later. All other browsers seemed fine.
onwarn: function (warning) {
    // Suppress this error message... there are hundreds of them. Angular team says to ignore it.
    // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
    if (warning.code === "THIS_IS_UNDEFINED") {
        return;
    }

    //skip these errors as well. UNRESOLVED_IMPORT will tell us about all of the esri imports being treated as external dependencies, which is good, but we don't need to see them.
    if(warning.code === "UNRESOLVED_IMPORT") {
        //check if the warning message contains one of the esri modules we've defined at the start of it, ie: 'esri/blahblah'. So only skip the warnings for those modules.
        var index = warning.message.indexOf("/");
        var modName = warning.message.substring(1, index);
        if(esriModuleList.indexOf(modName) !== -1){
            return;
        }
    }

    console.error(warning.code + ": " + warning.message);
},
plugins: [
    nodeResolve(
        { 
            jsnext: true, 
            module: true,
            skip: esriModuleList
        }),
    commonjs({
        include: 'node_modules/rxjs/**'
    }),
    uglify()
]
}