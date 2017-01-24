
import { Injectable } from '@angular/core';

import Graphic from 'esri/Graphic';
import SceneView from 'esri/views/SceneView';
import MapView from 'esri/views/MapView';
import watchUtils from 'esri/core/watchUtils';
import Point from 'esri/geometry/Point';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';

import { MapService } from './map.service';
import { MapViewService } from './mapView.service';
import { SceneViewService } from './sceneView.service';
import { DrawToolsService } from '../draw/drawTools.service';

import { CustomGraphicsLayer } from './esriextend/customGraphicsLayer';
import { Util } from '../shared/util';

@Injectable()
export class MapManagerService {

    is3dSupported: boolean = true;

    private _graphicsLayer: CustomGraphicsLayer;

    get activeView(): MapView | SceneView {
        if (this._mapViewService.isActive) return this._mapViewService.view;
        else return this._sceneViewService.view;
    }


    constructor(
        private _mapService: MapService,
        private _mapViewService: MapViewService,
        private _sceneViewService: SceneViewService,
        private _drawToolsService: DrawToolsService
    ) {
    }

    init() {
        this._initGraphicsLayer();
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
            this._sceneViewService.view.extent = this._mapViewService.view.extent;
        }

        this._mapViewService.isActive = viewType === "2d";
        this._sceneViewService.isActive = viewType === "3d";

        //set the active view in the draw tools service
        this._drawToolsService.view = this.activeView;


    }


    /**
     * Just add a point to the custom graphics layer
     * @param lat
     * @param lng
     */
    addPointToCustomGraphicsLayer(location: number[], attributes: any) {

        let point = new Point({
            x: location[0],
            y: location[1]
        });

        let g = new Graphic({
            geometry: point,
            symbol: new SimpleMarkerSymbol(),
            attributes: attributes
        });

        this._graphicsLayer.add(g);

    }

    private _initGraphicsLayer() {

        this._graphicsLayer = new CustomGraphicsLayer();
        this._mapService.map.add(this._graphicsLayer);

       
       
    }

}
