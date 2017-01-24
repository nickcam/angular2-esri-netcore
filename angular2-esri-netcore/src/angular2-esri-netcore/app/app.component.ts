
//initial import of rxjs operators that will be used.
import './rxjs-operators';

import { Component } from '@angular/core';

import { AppInitService } from './appInit.service';
  
@Component({
    selector: 'app-component',
    template: `
                <div *ngIf="appInitService.isLoading" class="loading-modal">
                    <div class="loading-content">
                        <i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>&nbsp;<span id="message">Loading app...</span>
                    </div>
                </div>
                <menus></menus>

                <esri-map-view></esri-map-view>
                <esri-scene-view></esri-scene-view>
                
              `
})
 
export class AppComponent {

    constructor(public appInitService: AppInitService) {
    }

    ngOnInit() {
        this.appInitService.init();
    }
}





