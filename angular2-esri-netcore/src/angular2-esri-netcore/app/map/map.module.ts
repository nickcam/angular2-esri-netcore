import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

//A Module that contains the services and components that wrap functionality of esri arcgis objects
import { MapViewComponent } from './mapView.component';
import { SceneViewComponent } from './sceneView.component';

import { MapService } from './map.service';
import { MapViewService } from './mapView.service';
import { SceneViewService } from './sceneView.service';
import { MapManagerService } from './mapManager.service';

@NgModule({
    imports: [
        SharedModule 
    ],
    declarations: [
        MapViewComponent,
        SceneViewComponent
    ],
    exports: [
        MapViewComponent,
        SceneViewComponent
    ],
    providers: [
        MapService,
        MapViewService,
        SceneViewService,
        MapManagerService
    ]
})
export class MapModule { }