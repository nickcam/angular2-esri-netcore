
import { Component } from '@angular/core';

import Basemap from 'esri/Basemap';

import { BaseMenuComponent } from '../shared/menu/baseMenu.component';
import { MapService } from '../map/map.service';


@Component({
    moduleId: module.id,
    selector: 'basemap-picker',
    templateUrl: 'basemapPicker.component.html',
    inputs: ["isOpen"],
    outputs: ["onClosed"]
})
export class BasemapPickerComponent extends BaseMenuComponent {

    basemapList: ESRIBasemap[] = [];

    constructor(public mapService: MapService) {
        super();
    }

    ngOnInit() {

        //init the list of basemaps
        this.basemapList.push(new ESRIBasemap("streets", "Streets", "streets.jpg"));
        this.basemapList.push(new ESRIBasemap("dark-gray", "Dark gray", "dark-gray.jpg"));
        this.basemapList.push(new ESRIBasemap("gray", "Gray", "gray.jpg"));
        this.basemapList.push(new ESRIBasemap("terrain", "Terrain", "terrain.jpg"));
        this.basemapList.push(new ESRIBasemap("hybrid", "Hybrid", "hybrid.jpg"));
        this.basemapList.push(new ESRIBasemap("oceans", "Oceans", "oceans.jpg"));
        this.basemapList.push(new ESRIBasemap("topo", "Topographic", "topo.jpg"));
        this.basemapList.push(new ESRIBasemap("osm", "Open street map", "osm.jpg"));
        this.basemapList.push(new ESRIBasemap("satellite", "Satellite", "satellite.jpg"));

        this.setBasemap(this.basemapList[0]);
    }

    onMenuOpened() {
        
    }

    setBasemap(basemap: ESRIBasemap) {

        for (let bm of this.basemapList) {
            bm.isActive = basemap === bm;
        }

        if (this.mapService.map.basemap.id === basemap.id) return;
        this.mapService.map.basemap = Basemap.fromId(basemap.id);
    }
} 


/**
 * Stub clas to hold references to ESRI basemaps
 */
class ESRIBasemap {
     
    isActive: boolean;
    get thumbnailUrl(): string {
        return "/staticfiles/basemaps/" + this.thumbnailFileName;
    } 

    constructor(public id: string, public title: string, public thumbnailFileName: string) {
    }
}