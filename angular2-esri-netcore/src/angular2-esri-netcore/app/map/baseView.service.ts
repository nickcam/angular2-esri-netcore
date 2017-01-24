import { Injectable } from '@angular/core';

import View from 'esri/views/View';
import MapView from 'esri/views/MapView';
import SceneView from 'esri/views/SceneView';
import Compass from 'esri/widgets/Compass';
import Zoom from 'esri/widgets/Zoom';

import { MapService } from './map.service';
import { BaseLoadedService } from '../shared/baseLoaded.service';

import { DrawToolsService } from '../draw/drawTools.service';

import { ServiceLocator } from '../serviceLocator';

@Injectable()
export class BaseViewService extends BaseLoadedService {

    isActive: boolean;
    view: MapView | SceneView;
    containerElementId: string;

    protected _mapService: MapService;

    private _drawToolsService: DrawToolsService;
     
    constructor(mapService: MapService) {
        super();

        this._mapService = mapService;
    }


    init() {

        //remove all ui components from the view - add the ones we want back in at whatever position we want.
        for (let comp of this.view.ui.components) {
            this.view.ui.remove(comp);
        }

        let compass = new Compass({ view: this.view });
        let zoom = new Zoom({ view: this.view });
        this.view.ui.add([zoom, compass], "bottom-right");

        //init the draw tools service using serviceLocator so it doens't need to be injected into inherited classes contructors
        this._drawToolsService = ServiceLocator.get<DrawToolsService>(DrawToolsService);
    }


    protected isLoaded() {
        //perform any common setup tasks across views after loading has completed

        //setup the popup options
        this._setupPopupForView();

        //init the draw tools service with this view if it hasn't been done intialiazed at all yet.
        if (!this._drawToolsService.view) {
            this._drawToolsService.init(this.view);
        }

    }

    private _setupPopupForView() {

        //set up an event for popup actions and the dock location
        this.view.popup.on("trigger-action", (evt) => this._popupAction(evt));
        this.view.popup.dockOptions.position = "top-right";

    }

    private _popupAction(evt) {
        let graphic = evt.detail.widget.selectedFeature;
        //perform custom popup actions

    }


}
