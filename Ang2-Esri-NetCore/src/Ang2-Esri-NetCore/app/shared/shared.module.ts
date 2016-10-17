
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SharedService } from './shared.service';

//A Shared service - not really used in this example except to re-export some angular modules and to expose the dummy shared.service that doesn't really do anything.

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule
    ],
    declarations: [
    ],
    exports: [

        //re-export some angular modules so other modules (ie: all of them) that reference shared module don't need to explicitly import them.
        CommonModule,
        FormsModule,
        HttpModule,
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