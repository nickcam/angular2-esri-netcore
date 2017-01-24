import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

//A Module that contains the services and components that wrap functionality of esri arcgis objects
import { MapViewComponent } from './mapView.component';
import { SceneViewComponent } from './sceneView.component';
import { ScaleBarComponent } from './scalebar.component';
import { PopupComponent } from './popup.component';

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
        SceneViewComponent,
        ScaleBarComponent,
        PopupComponent
    ],
    entryComponents: [
        PopupComponent //this needs to be in this section as it is dynamically created at runtime.
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