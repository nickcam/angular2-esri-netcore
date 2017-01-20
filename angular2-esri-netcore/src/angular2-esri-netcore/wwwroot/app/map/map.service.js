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
var Map_1 = require('esri/Map');
var MapService = (function () {
    function MapService() {
    }
    MapService.prototype.init = function () {
        if (this.map)
            return;
        this.map = new Map_1.default({
            ground: "world-elevation",
            basemap: "streets"
        });
    };
    MapService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MapService);
    return MapService;
}());
exports.MapService = MapService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9hcHAvbWFwL21hcC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQkFBMkIsZUFBZSxDQUFDLENBQUE7QUFFM0Msb0JBQWdCLFVBQVUsQ0FBQyxDQUFBO0FBRzNCO0lBR0k7SUFDQSxDQUFDO0lBRUQseUJBQUksR0FBSjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7WUFBQyxNQUFNLENBQUM7UUFFckIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQztZQUNmLE1BQU0sRUFBRSxpQkFBaUI7WUFDekIsT0FBTyxFQUFFLFNBQVM7U0FDckIsQ0FBQyxDQUFDO0lBRVAsQ0FBQztJQWZMO1FBQUMsaUJBQVUsRUFBRTs7a0JBQUE7SUFpQmIsaUJBQUM7QUFBRCxDQUFDLEFBaEJELElBZ0JDO0FBaEJZLGtCQUFVLGFBZ0J0QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IE1hcCBmcm9tICdlc3JpL01hcCc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBNYXBTZXJ2aWNlIHtcclxuICAgIG1hcDogTWFwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG4gICAgIFxyXG4gICAgaW5pdCgpIHsgXHJcbiAgICAgICAgaWYgKHRoaXMubWFwKSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMubWFwID0gbmV3IE1hcCh7XHJcbiAgICAgICAgICAgIGdyb3VuZDogXCJ3b3JsZC1lbGV2YXRpb25cIixcclxuICAgICAgICAgICAgYmFzZW1hcDogXCJzdHJlZXRzXCJcclxuICAgICAgICB9KTsgXHJcblxyXG4gICAgfVxyXG5cclxufVxyXG4iXX0=