import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MapModule } from '../map/map.module';

//A Module that contains the services and components that wrap functionality of esri arcgis objects
import { DrawToolsComponent } from './drawTools.component';
import { DrawToolsService } from './drawTools.service';


@NgModule({
    imports: [
        SharedModule,
        MapModule
    ],
    declarations: [
        DrawToolsComponent
    ],
    exports: [
        DrawToolsComponent
    ],
    providers: [
        DrawToolsService
    ]
})
export class DrawModule { }