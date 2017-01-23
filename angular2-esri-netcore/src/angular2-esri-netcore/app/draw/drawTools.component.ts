
import { Component } from '@angular/core';


import { BaseMenuComponent } from '../shared/menu/baseMenu.component';
import { MapService } from '../map/map.service';
import { DrawToolsService } from './drawTools.service';


@Component({
    moduleId: module.id,
    selector: 'draw-tools',
    templateUrl: 'drawTools.component.html',
    inputs: ["isOpen"],
    outputs: ["onClosed"]
})
export class DrawToolsComponent extends BaseMenuComponent {

     
    constructor(public drawToolsService: DrawToolsService) {
        super();
    }

    ngOnInit() {

     
    }

    onMenuOpened() {
    }

    draw(type: string) {
        this.drawToolsService.draw(type);
    }

    clear() {
        this.drawToolsService.clear();
    }

}

