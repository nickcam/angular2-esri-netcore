import { Component } from '@angular/core';

import MapView from 'esri/views/MapView';
import Point from 'esri/geometry/Point';
import Graphic from 'esri/Graphic';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import Color from 'esri/Color';

import { MapViewService } from './mapView.service';
import { CustomGraphicsLayer } from './esriextend/customGraphicsLayer';

@Component({
    selector: 'esri-map-view',
    template: `
                <div id="map-view" [class.inactive]="!mapViewService.isActive" class="view" >
                </div> 
             `
})
export class MapViewComponent {


    constructor(public mapViewService: MapViewService) {
    }


    ngOnInit() {
    }

      
} 
