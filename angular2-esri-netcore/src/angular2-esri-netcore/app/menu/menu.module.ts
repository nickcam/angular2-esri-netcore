import { NgModule } from '@angular/core';

//feature modules
import { MapModule } from '../map/map.module';
import { SharedModule } from '../shared/shared.module';
import { BasemapModule } from '../basemap/basemap.module';
import { DrawModule } from '../draw/draw.module';

import { MenusComponent } from './menus.component';


@NgModule({
    imports: [
        SharedModule,
        MapModule,
        BasemapModule,
        DrawModule
    ],
    declarations: [
        MenusComponent
    ],
    exports: [
        MenusComponent
    ],
    providers: [
    ]
})
export class MenuModule { }