
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MenuContainerComponent } from './menu/menuContainer.component';

import { SharedService } from './shared.service';

//A Shared service - 

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule
    ],
    declarations: [
        
        MenuContainerComponent
    ],
    exports: [

        //re-export some angular modules so other modules (ie: all of them) that reference shared module don't need to explicitly import them.
        CommonModule,
        FormsModule,
        HttpModule,

        MenuContainerComponent
    ],
    providers: [
        SharedService
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [SharedService]
        };
    }
}