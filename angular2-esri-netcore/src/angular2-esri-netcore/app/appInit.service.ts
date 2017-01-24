import { Injectable, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { MapService } from './map/map.service';
import { MapViewService } from './map/mapView.service';
import { SceneViewService } from './map/sceneView.service';
import { MapManagerService } from './map/mapManager.service';


@Injectable()
export class AppInitService {

    isLoading: boolean;

    constructor(
        private _mapService: MapService,
        private _mapViewService: MapViewService,
        private _sceneViewService: SceneViewService,
        private _mapManagerService: MapManagerService

    ) {
    }


    /**
     * Kick start loading of the app's bits and pieces. Loads some components first then others afterwards where a dependency exists.
     * Only one set of loading is called in example, could chain more together to load components in order if dependencies on one being loaded before another exists...or if no dependencies they could all load
     * in the forkJoin.
     */
    init() {

        this.isLoading = true;

        //default mapView to be active for now
        this._mapViewService.isActive = true;
        //this._sceneViewService.isActive = true;
         
        //Setup subscribers to listen for when services have completed loading
        
        //use forkJoin as the loaded$ observables on the ArcGIS based map services to load as one shot. They will be set to complete after they have loaded once.
        Observable.forkJoin<boolean[]>(
            this._mapViewService.loaded$,
            this._sceneViewService.loaded$
        )
        .subscribe(
            data => {

                //the next callback of forkJoin will only get hit once all observables have been completed, so no need to check for true values in the returned array.
                this._loadingComplete();

                //could chain loading by calling init on other services instead of completing above
                //this._someOtherService.init();

            },
            error => console.error("Error loading maps - %O", error)
        );


        /* If there was some component to load that had a depedency on the maps being created already, or vice versa by switching the order.
        this._someOtherService.loaded$.subscribe(
            data => {
                if (!data) return;
                
                this._loadingComplete(); //or some other dependency can start looading.
            },
            error => error => console.error("Error loading some other service - %O", error)
        );
        */

        //Kick off loading the map components
        this._mapService.init();
        this._mapViewService.init();
        this._sceneViewService.init();

        this._mapManagerService.init();
    }

    private _loadingComplete() {

        this.isLoading = false;

        //loading is finished so apply some defaults based on loaded data or do whatever.
        console.log('loading complete');


        //add some test points
        this._mapManagerService.addPointToCustomGraphicsLayer([134, -24], {});
        this._mapManagerService.addPointToCustomGraphicsLayer([138, -27], {});
        this._mapManagerService.addPointToCustomGraphicsLayer([140, -30], {});


    }

}