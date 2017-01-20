/// <reference path="../typings/index.d.ts" />
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
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
//feature modules
var map_module_1 = require('./map/map.module');
var shared_module_1 = require('./shared/shared.module');
//components
var app_component_1 = require('./app.component');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                shared_module_1.SharedModule.forRoot(),
                map_module_1.MapModule
            ],
            declarations: [
                app_component_1.AppComponent
            ],
            providers: [],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2FwcC9hcHAubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhDQUE4Qzs7Ozs7Ozs7Ozs7QUFHOUMscUJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBQ3pDLGlDQUE4QiwyQkFBMkIsQ0FBQyxDQUFBO0FBQzFELHNCQUE0QixnQkFBZ0IsQ0FBQyxDQUFBO0FBQzdDLHFCQUEyQixlQUFlLENBQUMsQ0FBQTtBQUUzQyxpQkFBaUI7QUFDakIsMkJBQTBCLGtCQUFrQixDQUFDLENBQUE7QUFDN0MsOEJBQTZCLHdCQUF3QixDQUFDLENBQUE7QUFFdEQsWUFBWTtBQUNaLDhCQUE2QixpQkFBaUIsQ0FBQyxDQUFBO0FBb0IvQztJQUFBO0lBQXlCLENBQUM7SUFqQjFCO1FBQUMsZUFBUSxDQUFDO1lBQ04sT0FBTyxFQUFFO2dCQUNMLGdDQUFhO2dCQUNiLG1CQUFXO2dCQUNYLGlCQUFVO2dCQUVWLDRCQUFZLENBQUMsT0FBTyxFQUFFO2dCQUN0QixzQkFBUzthQUNaO1lBQ0QsWUFBWSxFQUFFO2dCQUNWLDRCQUFZO2FBRWY7WUFDRCxTQUFTLEVBQUUsRUFDVjtZQUNELFNBQVMsRUFBRSxDQUFDLDRCQUFZLENBQUM7U0FDNUIsQ0FBQzs7aUJBQUE7SUFDdUIsZ0JBQUM7QUFBRCxDQUFDLEFBQTFCLElBQTBCO0FBQWIsaUJBQVMsWUFBSSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcbiBcclxuIFxyXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBCcm93c2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBIdHRwTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XHJcblxyXG4vL2ZlYXR1cmUgbW9kdWxlc1xyXG5pbXBvcnQgeyBNYXBNb2R1bGUgfSBmcm9tICcuL21hcC9tYXAubW9kdWxlJztcclxuaW1wb3J0IHsgU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XHJcblxyXG4vL2NvbXBvbmVudHNcclxuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSAnLi9hcHAuY29tcG9uZW50JztcclxuXHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gICAgaW1wb3J0czogW1xyXG4gICAgICAgIEJyb3dzZXJNb2R1bGUsXHJcbiAgICAgICAgRm9ybXNNb2R1bGUsXHJcbiAgICAgICAgSHR0cE1vZHVsZSxcclxuXHJcbiAgICAgICAgU2hhcmVkTW9kdWxlLmZvclJvb3QoKSxcclxuICAgICAgICBNYXBNb2R1bGVcclxuICAgIF0sXHJcbiAgICBkZWNsYXJhdGlvbnM6IFtcclxuICAgICAgICBBcHBDb21wb25lbnRcclxuICAgICAgIFxyXG4gICAgXSxcclxuICAgIHByb3ZpZGVyczogW1xyXG4gICAgXSxcclxuICAgIGJvb3RzdHJhcDogW0FwcENvbXBvbmVudF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7IH0iXX0=