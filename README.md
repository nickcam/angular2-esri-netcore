# angular2-esri-netcore
Starter project for using Angular 2 and ArcGIS js api in a .Net Core project.

Created using Visual Studio 2015 with the following relevant tools installed:
  - ASP.Net and Web Tools 2015.1 (14.1.20907.0)
  - Microsoft .Net Core Tools (Preview 2) (14.1.20907.0)
  - Typescript 2.2.1

Uses arcgis api v4.3. Added some basic component and service patterns for UI and map operations.

Couple of extra tools in here as well:
### Drawing tools
`./app/map/esriextend/drawTools.ts`

4.3 doesn't have any draw tools so created this as I needed some. The class itself doesn't use anything angular2, so it can be dropped into other arcgis projects. It's written in typescript though, so will need to be compiled to run in a javascript app.

### ComponentPopupTemplate
`./app/map/esriextend/componentPopupTemplate.ts`

A subclass of PopupTemplate that loads an angular component in the content of the popup. Means you can use all the goodness of components to render popups.

## Run it
Run `npm install` in the project folder (or edit and save the package.json file within Visual Studio).

Run the gulp task `build:dist` to compile using the Angular ngc compiler and rollup to create a single build file to load.

## Dist build
Have added a boolean server variable `useDistBuild` to Views/Home/Index.cshtml to control whether to load the dist build or just run normally. Just change it to true to use the dist build file produced by rollup through the `dist:build` gulp task.

## Note
After upgrading to angular 4.0.0-rc.3 a node folder is added under @types - ie: node_modules/@types/node. Some of the types in here conflict with types defined in esri-system-js which stops the typescript from compiling. Just delete the node folder and it's all good. Should be a nicer way around this though...possibly just fork esri-system-js and change the type names to something different or hopefully angular will remove the node types dependency in a future release.


