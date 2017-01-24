import { Component } from '@angular/core';

import { Util } from '../shared/util';
import { MapManagerService } from '../map/mapManager.service';


@Component({
    moduleId: module.id,
    selector: 'menus',
    templateUrl: 'menus.component.html'
     
})
export class MenusComponent {
     
    fullScreenSupported: boolean;
    webglSupported: boolean;
    menuList: MenuList = new MenuList();

    constructor(
        public mapManagerService: MapManagerService
    ) {
    }
     
    ngOnInit() {
        this.webglSupported = Util.supportsWebGL();
        this.fullScreenSupported = Util.supportsFullScreen();
    }
     
    toggleMenu(menuName, open) {
        if (open) {
            for (let p in this.menuList) {
                if (this.menuList[p] === true && p !== menuName) {
                    this.menuList[p] = false;
                }
            }
        }
        this.menuList[menuName] = open;
    }


    toggleView(viewType) {
        this.mapManagerService.setActiveView(viewType);
    }

     
    toggleFullScreen() {
        Util.toggleFullScreen();
    }

}

class MenuList {

    public BASEMAPS: string = "Basemaps";
    public DRAW_TOOLS: string = "DrawTools";

    constructor() {
        this[this.BASEMAPS] = false;
        this[this.DRAW_TOOLS] = false;
    }
}