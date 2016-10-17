import { Injectable } from '@angular/core';

import Map from 'esri/Map';

@Injectable()
export class MapService {
    map: Map;

    constructor() {
    }

    init() {
        if (this.map) return;

        this.map = new Map({
            ground: "world-elevation",
            basemap: "streets"
        });

    }

}
