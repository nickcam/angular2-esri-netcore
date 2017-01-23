
import { Injectable } from '@angular/core';

import SceneView from 'esri/views/SceneView';
import MapView from 'esri/views/MapView';

import { MapViewService } from './mapView.service';
import { SceneViewService } from './sceneView.service';
import { DrawToolsService } from '../draw/drawTools.service';


@Injectable()
export class MapManagerService {

    get activeView(): MapView | SceneView {
        if (this._mapViewService.isActive) return this._mapViewService.view;
        else return this._sceneViewService.view;
    }



    constructor(
        private _mapViewService: MapViewService,
        private _sceneViewService: SceneViewService,
        private _drawToolsService: DrawToolsService
    ) {

    }

    /** 
        Sets the active view. Attempts to zoom the newly selected view to the same area as the previously selected one.
    */
    setActiveView(viewType) {
     
        if (viewType === this.activeView.type) return; //it's already active

        if (viewType === "2d") {
            //sync map views location to scene views
            this._mapViewService.view.viewpoint = this._sceneViewService.view.viewpoint;
        }
        else {
            //sync scene views location to map views - setting the extent seems to work a whole lot better than setting the viewpoint when swapping to 3D.
            //this.sceneViewService.view.viewpoint = this.mapViewService.view.viewpoint;
            this._sceneViewService.view.extent = this._mapViewService.view.extent;
        }

        this._mapViewService.isActive = viewType === "2d";
        this._sceneViewService.isActive = viewType === "3d";

        //set the active view in the draw tools service
        this._drawToolsService.view = this.activeView;


    }


}
