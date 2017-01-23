/// <reference path="../typings/index.d.ts" />
 
import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//feature modules
import { MapModule } from './map/map.module';
import { SharedModule } from './shared/shared.module';
import { MenuModule } from './menu/menu.module';

//components
import { AppComponent } from './app.component';

//services
import { AppInitService } from './appInit.service';

import { ServiceLocator } from './serviceLocator';
 
@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,

        SharedModule.forRoot(),
        MapModule,
        MenuModule
    ],
    declarations: [
        AppComponent
       
    ],
    providers: [
        AppInitService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { 
    constructor(private _injector: Injector) {
        //set the injected Injector object into a static variable on the servicelocator class on startup.
        ServiceLocator.injector = _injector;
    }

}