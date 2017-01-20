"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var shared_module_1 = require('../shared/shared.module');
//A Module that contains the services and components that wrap functionality of esri arcgis objects
var mapView_component_1 = require('./mapView.component');
var map_service_1 = require('./map.service');
var MapModule = (function () {
    function MapModule() {
    }
    MapModule = __decorate([
        core_1.NgModule({
            imports: [
                shared_module_1.SharedModule
            ],
            declarations: [
                mapView_component_1.MapViewComponent
            ],
            exports: [
                mapView_component_1.MapViewComponent
            ],
            providers: [
                map_service_1.MapService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], MapModule);
    return MapModule;
}());
exports.MapModule = MapModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9tYXAvbWFwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBRXpDLDhCQUE2Qix5QkFBeUIsQ0FBQyxDQUFBO0FBRXZELG1HQUFtRztBQUNuRyxrQ0FBaUMscUJBQXFCLENBQUMsQ0FBQTtBQUV2RCw0QkFBMkIsZUFBZSxDQUFDLENBQUE7QUFnQjNDO0lBQUE7SUFBeUIsQ0FBQztJQWQxQjtRQUFDLGVBQVEsQ0FBQztZQUNOLE9BQU8sRUFBRTtnQkFDTCw0QkFBWTthQUNmO1lBQ0QsWUFBWSxFQUFFO2dCQUNWLG9DQUFnQjthQUNuQjtZQUNELE9BQU8sRUFBRTtnQkFDTCxvQ0FBZ0I7YUFDbkI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1Asd0JBQVU7YUFDYjtTQUNKLENBQUM7O2lCQUFBO0lBQ3VCLGdCQUFDO0FBQUQsQ0FBQyxBQUExQixJQUEwQjtBQUFiLGlCQUFTLFlBQUksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBTaGFyZWRNb2R1bGUgfSBmcm9tICcuLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XHJcbiBcclxuLy9BIE1vZHVsZSB0aGF0IGNvbnRhaW5zIHRoZSBzZXJ2aWNlcyBhbmQgY29tcG9uZW50cyB0aGF0IHdyYXAgZnVuY3Rpb25hbGl0eSBvZiBlc3JpIGFyY2dpcyBvYmplY3RzXHJcbmltcG9ydCB7IE1hcFZpZXdDb21wb25lbnQgfSBmcm9tICcuL21hcFZpZXcuY29tcG9uZW50JztcclxuXHJcbmltcG9ydCB7IE1hcFNlcnZpY2UgfSBmcm9tICcuL21hcC5zZXJ2aWNlJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgU2hhcmVkTW9kdWxlIFxyXG4gICAgXSxcclxuICAgIGRlY2xhcmF0aW9uczogW1xyXG4gICAgICAgIE1hcFZpZXdDb21wb25lbnRcclxuICAgIF0sXHJcbiAgICBleHBvcnRzOiBbXHJcbiAgICAgICAgTWFwVmlld0NvbXBvbmVudFxyXG4gICAgXSxcclxuICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIE1hcFNlcnZpY2VcclxuICAgIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE1hcE1vZHVsZSB7IH0iXX0=