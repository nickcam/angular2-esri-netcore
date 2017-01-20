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
var MapView_1 = require('esri/views/MapView');
var Point_1 = require('esri/geometry/Point');
var Graphic_1 = require('esri/Graphic');
var SimpleMarkerSymbol_1 = require('esri/symbols/SimpleMarkerSymbol');
var Color_1 = require('esri/Color');
var map_service_1 = require('./map.service');
var customGraphicsLayer_1 = require('./esriextend/customGraphicsLayer');
var MapViewComponent = (function () {
    function MapViewComponent(_mapService) {
        this._mapService = _mapService;
    }
    MapViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._mapService.init();
        //create a new MapView and assign it to the property
        this.view = new MapView_1.default({
            container: "map-view",
            map: this._mapService.map,
            scale: 45700000,
            center: [134, -24]
        });
        this.view.then(function () { return _this.mapViewLoaded(); });
    };
    MapViewComponent.prototype.mapViewLoaded = function () {
        console.log('map view loaded');
        //use the custom graphics layer to add a random point to the map
        var cgl = new customGraphicsLayer_1.CustomGraphicsLayer();
        this._mapService.map.add(cgl);
        var p = new Point_1.default({
            x: 134,
            y: -24
        });
        var s = new SimpleMarkerSymbol_1.default({
            size: 10,
            color: new Color_1.default([255, 0, 0])
        });
        var g = new Graphic_1.default({
            geometry: p,
            attributes: {},
            symbol: s
        });
        cgl.add(g);
    };
    MapViewComponent = __decorate([
        core_1.Component({
            selector: 'esri-map-view',
            template: "\n                <div id=\"map-view\" class=\"view\" >\n                </div>\n             "
        }), 
        __metadata('design:paramtypes', [map_service_1.MapService])
    ], MapViewComponent);
    return MapViewComponent;
}());
exports.MapViewComponent = MapViewComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwVmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9hcHAvbWFwL21hcFZpZXcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQkFBMEIsZUFBZSxDQUFDLENBQUE7QUFFMUMsd0JBQW9CLG9CQUFvQixDQUFDLENBQUE7QUFDekMsc0JBQWtCLHFCQUFxQixDQUFDLENBQUE7QUFDeEMsd0JBQW9CLGNBQWMsQ0FBQyxDQUFBO0FBQ25DLG1DQUErQixpQ0FBaUMsQ0FBQyxDQUFBO0FBQ2pFLHNCQUFrQixZQUFZLENBQUMsQ0FBQTtBQUUvQiw0QkFBMkIsZUFBZSxDQUFDLENBQUE7QUFDM0Msb0NBQW9DLGtDQUFrQyxDQUFDLENBQUE7QUFTdkU7SUFJSSwwQkFBb0IsV0FBdUI7UUFBdkIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7SUFDM0MsQ0FBQztJQUdELG1DQUFRLEdBQVI7UUFBQSxpQkFjQztRQVpHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFeEIsb0RBQW9EO1FBQ3BELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxpQkFBTyxDQUFDO1lBQ3BCLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUc7WUFDekIsS0FBSyxFQUFFLFFBQVE7WUFDZixNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDckIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxhQUFhLEVBQUUsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO0lBRS9DLENBQUM7SUFFRCx3Q0FBYSxHQUFiO1FBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBRS9CLGdFQUFnRTtRQUNoRSxJQUFJLEdBQUcsR0FBRyxJQUFJLHlDQUFtQixFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTlCLElBQUksQ0FBQyxHQUFHLElBQUksZUFBSyxDQUFDO1lBQ2QsQ0FBQyxFQUFFLEdBQUc7WUFDTixDQUFDLEVBQUUsQ0FBQyxFQUFFO1NBQ1QsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLEdBQUcsSUFBSSw0QkFBa0IsQ0FBQztZQUMzQixJQUFJLEVBQUUsRUFBRTtZQUNSLEtBQUssRUFBRSxJQUFJLGVBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDaEMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEdBQUcsSUFBSSxpQkFBTyxDQUFDO1lBQ2hCLFFBQVEsRUFBRSxDQUFDO1lBQ1gsVUFBVSxFQUFFLEVBQUU7WUFDZCxNQUFNLEVBQUUsQ0FBQztTQUNaLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZixDQUFDO0lBdkRMO1FBQUMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxlQUFlO1lBQ3pCLFFBQVEsRUFBRSxnR0FHQTtTQUNiLENBQUM7O3dCQUFBO0lBa0RGLHVCQUFDO0FBQUQsQ0FBQyxBQWpERCxJQWlEQztBQWpEWSx3QkFBZ0IsbUJBaUQ1QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgTWFwVmlldyBmcm9tICdlc3JpL3ZpZXdzL01hcFZpZXcnO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSAnZXNyaS9nZW9tZXRyeS9Qb2ludCc7XHJcbmltcG9ydCBHcmFwaGljIGZyb20gJ2VzcmkvR3JhcGhpYyc7XHJcbmltcG9ydCBTaW1wbGVNYXJrZXJTeW1ib2wgZnJvbSAnZXNyaS9zeW1ib2xzL1NpbXBsZU1hcmtlclN5bWJvbCc7XHJcbmltcG9ydCBDb2xvciBmcm9tICdlc3JpL0NvbG9yJztcclxuXHJcbmltcG9ydCB7IE1hcFNlcnZpY2UgfSBmcm9tICcuL21hcC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ3VzdG9tR3JhcGhpY3NMYXllciB9IGZyb20gJy4vZXNyaWV4dGVuZC9jdXN0b21HcmFwaGljc0xheWVyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdlc3JpLW1hcC12aWV3JyxcclxuICAgIHRlbXBsYXRlOiBgXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwibWFwLXZpZXdcIiBjbGFzcz1cInZpZXdcIiA+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgIGBcclxufSlcclxuZXhwb3J0IGNsYXNzIE1hcFZpZXdDb21wb25lbnQge1xyXG5cclxuICAgIHZpZXc6IE1hcFZpZXc7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfbWFwU2VydmljZTogTWFwU2VydmljZSkge1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fbWFwU2VydmljZS5pbml0KCk7XHJcblxyXG4gICAgICAgIC8vY3JlYXRlIGEgbmV3IE1hcFZpZXcgYW5kIGFzc2lnbiBpdCB0byB0aGUgcHJvcGVydHlcclxuICAgICAgICB0aGlzLnZpZXcgPSBuZXcgTWFwVmlldyh7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcjogXCJtYXAtdmlld1wiLFxyXG4gICAgICAgICAgICBtYXA6IHRoaXMuX21hcFNlcnZpY2UubWFwLFxyXG4gICAgICAgICAgICBzY2FsZTogNDU3MDAwMDAsIFxyXG4gICAgICAgICAgICBjZW50ZXI6IFsxMzQsIC0yNF1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy52aWV3LnRoZW4oKCkgPT4gdGhpcy5tYXBWaWV3TG9hZGVkKCkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBtYXBWaWV3TG9hZGVkKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdtYXAgdmlldyBsb2FkZWQnKTtcclxuXHJcbiAgICAgICAgLy91c2UgdGhlIGN1c3RvbSBncmFwaGljcyBsYXllciB0byBhZGQgYSByYW5kb20gcG9pbnQgdG8gdGhlIG1hcFxyXG4gICAgICAgIGxldCBjZ2wgPSBuZXcgQ3VzdG9tR3JhcGhpY3NMYXllcigpO1xyXG4gICAgICAgIHRoaXMuX21hcFNlcnZpY2UubWFwLmFkZChjZ2wpO1xyXG5cclxuICAgICAgICBsZXQgcCA9IG5ldyBQb2ludCh7XHJcbiAgICAgICAgICAgIHg6IDEzNCxcclxuICAgICAgICAgICAgeTogLTI0XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgbGV0IHMgPSBuZXcgU2ltcGxlTWFya2VyU3ltYm9sKHsgICBcclxuICAgICAgICAgICAgc2l6ZTogMTAsXHJcbiAgICAgICAgICAgIGNvbG9yOiBuZXcgQ29sb3IoWzI1NSwgMCwgMF0pICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgZyA9IG5ldyBHcmFwaGljKHtcclxuICAgICAgICAgICAgZ2VvbWV0cnk6IHAsXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHt9LCBcclxuICAgICAgICAgICAgc3ltYm9sOiBzICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY2dsLmFkZChnKTtcclxuICAgIH1cclxufSBcclxuIl19