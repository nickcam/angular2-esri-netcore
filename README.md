# angular2-esri-netcore
Starter project for using Angular 2 and ArcGIS js api in a .Net Core project.

Created using Visual Studio 2015 with the following relevant tools installed:
  - ASP.Net and Web Tools 2015.1 (14.1.20907.0)
  - Microsoft .Net Core Tools (Preview 2) (14.1.20907.0)
  - Typescript 2.0.10

Uses arcgis api v4.2. Added some basic component and service patterns for UI and map operations.

Couple of extra tools in here as well:
### Drawing tools
`./app/map/esriextend/drawTools.ts`
4.2 doesn't have any draw tools so created this as I needed some. The class itself doesn't use anything angular2, so it can be dropped into other arcgis projects. It's written in typescript though, so will need to be compiled to run in a javascript app.
  
### Scale bar component
`./app/map/scalebar.component.ts`
An angular2 component that adds a scale bar to the views. 
Calculates the geodesic length between the two edges of the scale bar DOM element to get the lengths to display in the bar.

Couldn't make it inherit from esri/Widget so it could be added with other widgets as the jsx format wouldn't compile within the angular2  app.


## Run it
Run `npm install` in the project folder (or edit and save the package.json file within Visual Studio).

Run the gulp task `build:dist` to compile using the Angular ngc compiler and rollup to create a single build file to load.

## Dist build
Have added a boolean server variable `useDistBuild` to Views/Home/Index.cshtml to control whether to load the dist build or just run normally. Just change it to true to use the dist build file produced by rollup through the `dist:build` gulp task.


 
 


