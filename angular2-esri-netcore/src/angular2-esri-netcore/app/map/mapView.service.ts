import { Injectable } from '@angular/core';

import MapView from 'esri/views/MapView';

import { MapService } from './map.service';
import { BaseViewService } from './baseView.service';


@Injectable()
export class MapViewService extends BaseViewService {

    view: MapView;

    constructor(_mapService: MapService) {
        super(_mapService);
        this.containerElementId = "map-view";
    }

    init() {
        if (this.view != null)
            return;

        //create a new MapView and assign it to the property
        this.view = new MapView({
            container: this.containerElementId,
            map: this._mapService.map,
            scale: 45700000, //default scale and center point
            center: [134, -24]
        });


        this.view.then(() => this._mapViewLoaded());
        this.view.otherwise((err) => {
            console.log(err);
            //view failed to load, emit loaded to subscribers.
            this._loaded.next(true);
            this._loaded.complete();
        });

        super.init();

    }

    private _mapViewLoaded() {
        //view is loaded so emit true to subscribers
        this._loaded.next(true);
        this._loaded.complete();

        super.isLoaded();
    }

}
