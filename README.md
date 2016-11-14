# Ang2-Esri-NetCore
Starter project for using Angular 2 and ArcGIS js api in a .Net Core project.

Uses ArcGIS v4.1. Doesn't do much, just loads a map view and adds a point to custom graphics layer.

Created using Visual Studio 2015 using with the following relevant tools installed:
  - ASP.Net and Web Tools 2015.1 (14.1.20907.0)
  - Microsoft .Net Core Tools (Preview 2) (14.1.20907.0)
  - Typescript 2.0.3.0
  
 
## Run it
Run `npm install` in the project folder (or edit and save the package.json file within Visual Studio).

Run the gulp task `dist:build` to compile using the Angular ngc compiler and rollup to create a single build file to load.

## Dist build
Have added a boolean server variable `useDistBuild` to Views/Home/Index.cshtml to control whether to load the dist build or just run normally. Just change it to true to use the dist build file produced by rollup through the `dist:build` gulp task.


 
 


