import { Component } from '@angular/core';

import MapView from 'esri/views/MapView';
import Point from 'esri/geometry/Point';
import Graphic from 'esri/Graphic';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import Color from 'esri/Color';

import { MapService } from './map.service';
import { CustomGraphicsLayer } from './esriextend/customGraphicsLayer';

@Component({
    selector: 'esri-map-view',
    template: `
                <div id="map-view" class="view" >
                </div>
             `
})
export class MapViewComponent {

    view: MapView;

    constructor(private _mapService: MapService) {
    }


    ngOnInit() {

        this._mapService.init();

        //create a new MapView and assign it to the property
        this.view = new MapView({
            container: "map-view",
            map: this._mapService.map,
            scale: 45700000, 
            center: [134, -24],
            ui: { components: ["zoom", "compass"] }
        });

        this.view.then(() => this.mapViewLoaded());

    }

    mapViewLoaded() {
        console.log('map view loaded');

        //use the custom graphics layer to add a random point to the map
        let cgl = new CustomGraphicsLayer();
        this._mapService.map.add(cgl);

        let p = new Point({
            x: 134,
            y: -24
        })

        let s = new SimpleMarkerSymbol({   
            size: 10,
            color: new Color([255, 0, 0])          
        });

        let g = new Graphic({
            geometry: p,
            attributes: {}, 
            symbol: s           
        });

        cgl.add(g);
    }
} 
