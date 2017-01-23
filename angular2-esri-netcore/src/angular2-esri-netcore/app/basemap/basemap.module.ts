import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MapModule } from '../map/map.module';

//A Module that contains the services and components that wrap functionality of esri arcgis objects
import { BasemapPickerComponent } from './basemapPicker.component';


@NgModule({
    imports: [
        SharedModule,
        MapModule
    ],
    declarations: [
        BasemapPickerComponent,
    ],
    exports: [
        BasemapPickerComponent
    ],
    providers: [
    ]
})
export class BasemapModule { }