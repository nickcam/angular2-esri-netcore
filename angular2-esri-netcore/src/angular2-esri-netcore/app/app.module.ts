/// <reference path="../typings/index.d.ts" />
 

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//feature modules
import { MapModule } from './map/map.module';
import { SharedModule } from './shared/shared.module';

//components
import { AppComponent } from './app.component';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,

        SharedModule.forRoot(),
        MapModule
    ],
    declarations: [
        AppComponent
       
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }