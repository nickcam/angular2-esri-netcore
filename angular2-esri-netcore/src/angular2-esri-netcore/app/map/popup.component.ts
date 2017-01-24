import { Component, Input, Injector, ChangeDetectorRef } from '@angular/core';

import Graphic from 'esri/Graphic';

@Component({
    moduleId: module.id,
    selector: 'popup-content',
    templateUrl: './popup.component.html',
    styles: [
        `
            .attribute {
                margin: 3px 0;
            }

            .attribute span {
                width: 45%;
                display: inline-block;
            }

            span.attr-label {
                font-weight: bold;
                color: #323232;
            }

        `
    ]
})
export class PopupComponent {

    @Input()
    feature: any;

    attributes: any;
    attributesArray: any[];

    constructor(
        private _injector: Injector,
        private _cdr: ChangeDetectorRef) {
    }
     
    
    ngOnInit() {

        //have to use injector to get the feature property added by componentPopupTemplate
        this.feature = this._injector.get('feature');

        //Just getting the attributes so they can be looped in the template. 
        //Could also read the PopupTemplates fieldInfos or whatever and use thsoe to build the UI so they could be configured as part of componentPopupTemplates options.

        if (this.feature.graphic.attributes) {
            this.attributes = this.feature.graphic.attributes;

            //map the attributes object keys to an array so they can be looped in the template.
            this.attributesArray = Object.keys(this.attributes);
        }
    }

}