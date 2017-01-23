import { Injectable } from '@angular/core';

import watchUtils from 'esri/core/watchUtils';
import MapView from 'esri/views/MapView';
import SceneView from 'esri/views/SceneView';
import Graphic from 'esri/Graphic';

import { DrawTools } from '../map/esriextend/drawTools';

/**
 * Singleton service to contain a single instance of drawTools within the app. Basically just wraps calls to drawTools but allows us to maintain the active of two views more easily.
 */
@Injectable()
export class DrawToolsService {

    drawTools: DrawTools;
    view: MapView | SceneView;

    ready: boolean;

    constructor() {
    }

    init(view: MapView | SceneView) {
        //init with the view passed in
        this.drawTools = new DrawTools(view);
        this.view = view;

        watchUtils.whenTrue(this.drawTools, "ready", () => {
            this.ready = true;
        });

        //wire up to the drawTools draw-complete emitted event
        this.drawTools.on("draw-complete", (graphic) => this._drawComplete(graphic));
    }

    draw(type: string) {
        this.drawTools.view = this.view;
        this.drawTools.draw(type);
    }


    clear(graphic?: Graphic) {
        if (!graphic) {
            this.drawTools.clear();
        }
    }

    private _drawComplete(graphic) {
        //do something with drawn graphic
    }

}