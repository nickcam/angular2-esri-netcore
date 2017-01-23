import { Injectable } from '@angular/core';

import SceneView from 'esri/views/SceneView';

import { MapService } from './map.service';
import { BaseViewService } from './baseView.service';
import { Util } from '../shared/util';

@Injectable()
export class SceneViewService extends BaseViewService {

    view: SceneView;
    isSupported: boolean = true;

    constructor(_mapService: MapService) {

        super(_mapService);
        this.containerElementId = "scene-view";
    }

    init() {
        if (this.view != null)
            return;

        //does the browser support web gl.
        this.isSupported = Util.supportsWebGL();
        if (this.isSupported) {

            //only load scene view if webgl supported
            this.view = new SceneView({
                container: this.containerElementId,
                map: this._mapService.map,
                scale: 45700000, //default scale and center point
                center: [134, -24]
            });

            this.view
                .then(() => {
                    this._sceneViewLoaded(true);
                })
                .otherwise((err) => {
                    console.error(err);
                    this._sceneViewLoaded(false);
                });

            super.init();
        }
        else {

            //indicate view is loaded event though it didn't try to as it's not supported, emit to subscriber to indicate it's done.
            this._loaded.next(true);
            this._loaded.complete();
        }


    }

    private _sceneViewLoaded(success) {

        if (!success) {
            this.isSupported = false;
        }

        //view is loaded, emit event to indicate it is
        this._loaded.next(true);
        this._loaded.complete();

        super.isLoaded();
    }

}
