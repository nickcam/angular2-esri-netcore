import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

//A Module that contains the services and components that wrap functionality of esri arcgis objects
import { MapViewComponent } from './mapView.component';

import { MapService } from './map.service';

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        MapViewComponent
    ],
    exports: [
        MapViewComponent
    ],
    providers: [
        MapService
    ]
})
export class MapModule { }