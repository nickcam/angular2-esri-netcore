# angular2-esri-netcore
Starter project for using Angular 2 and ArcGIS js api in a .Net Core project.

Uses arcgis api v4.2. Contains some basic component and service patterns, for UI and map operations.

Couple of extra tools in here as well:
### Drawing tools
drawTools class - ./app/map/esriextend/drawTools.ts. 4.2 doesn't have any draw tools so added this is. The class itself doesn't use anything angular2, so it can be dropped into other arcgis projects. It's written in typescript though, so will need to be compiled to run in a javascript app.

Created using Visual Studio 2015 using with the following relevant tools installed:
  - ASP.Net and Web Tools 2015.1 (14.1.20907.0)
  - Microsoft .Net Core Tools (Preview 2) (14.1.20907.0)
  - Typescript 2.1.5.0
  
 
## Run it
Run `npm install` in the project folder (or edit and save the package.json file within Visual Studio).

Run the gulp task `build:dist` to compile using the Angular ngc compiler and rollup to create a single build file to load.

## Dist build
Have added a boolean server variable `useDistBuild` to Views/Home/Index.cshtml to control whether to load the dist build or just run normally. Just change it to true to use the dist build file produced by rollup through the `dist:build` gulp task.


 
 


