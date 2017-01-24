import { Component, Input, DoCheck, ViewChild, ElementRef } from '@angular/core';

import watchUtils from 'esri/core/watchUtils';
import MapView from 'esri/views/MapView';
import SceneView from 'esri/views/SceneView';
import ScreenPoint from 'esri/geometry/ScreenPoint';
import Point from 'esri/geometry/Point';
import Polyline from 'esri/geometry/Polyline';
import geometryEngine from 'esri/geometry/geometryEngine';


@Component({
    moduleId: module.id,
    selector: 'scale-bar',
    template: `
                <div [style.visibility]="!isVisible ? 'hidden' : 'visible'" class="scale-container" [ngStyle]="positionStyles" >
                    <div class="text">
                        <span class='start'>0</span>
                        <span class='middle'>{{middle}}{{unit}}</span>
                        <span class='middle-bar'></span>
                        <span class='end'>{{end}}{{unit}}</span> 
                    </div>
                    <div #scale class="bar" ></div>
                    
                </div>
              `,
    styleUrls: ['scalebar.css']
})
export class ScaleBarComponent {

    @Input()
    view: MapView | SceneView;

    //can pass in position of element to override styles if desired.
    @Input()
    left: number;

    @Input()
    top: number;

    @Input()
    bottom: number;

    @Input()
    right: number;

    @ViewChild("scale")
    scale: ElementRef;

    unit: string = "km"
    middle: string;
    end: string;
    isVisible: boolean;

    get positionStyles(): any {
        let position: any = {};
        if (this.left) position.left = this.left + "px";
        if (this.top) position.rop = this.top + "px";
        if (this.right) position.right = this.right + "px";
        if (this.bottom) position.bottom = this.bottom + "px";
        return position;
    }

    private _viewSet: boolean;
    private _polyline: Polyline;

    constructor() {

    }

    /**
     * Use doCheck to check for the existence of the view and once it exists assign the stationary watch.
     */
    ngDoCheck() {
        if (this._viewSet) return;
        else if (this.view) {
            //when view has finished loading run calculate scale 
            this.view.then(() => this._calculateScale());

            //set a watch on stationary so scale is calculated every time the map finishes moving
            watchUtils.whenTrue(this.view, "stationary", () => this._calculateScale());
            this._viewSet = true;
        }
    }

    ngOnInit() {

    }

    private _calculateScale() {

        //default to be visible - wil be made invisible if the scale was not able to be calculated later on. ie: in a scene view if we can't get map points as the scale control is off the globe.
        this.isVisible = true;

        if (!this.view.ready) return;

        //get the ScreenPoints that represent the left and right section of the bar element
        let scaleRect = this.scale.nativeElement.getBoundingClientRect();

        let ss = new ScreenPoint({
            x: scaleRect.left,
            y: scaleRect.top
        });

        let se = new ScreenPoint({
            x: scaleRect.right,
            y: scaleRect.top
        });

        //get the map points of these screen points
        let ms = this.view.toMap(ss);
        let me = this.view.toMap(se);

        //get the distance between the two points in metres
        if (!ms || !me) { this.isVisible = false; return; };

        //Get the length using geodesicLength function with a polyline. We need a polyline to do this.
        if (!this._polyline) {
            this._polyline = new Polyline({
                spatialReference: ms.spatialReference
            });

            this._polyline.paths.push([[ms.x, ms.y], [me.x, me.y]]);
        }
        else {
            this._polyline.paths = [];
            this._polyline.paths.push([[ms.x, ms.y], [me.x, me.y]]);
        }

        let dist = geometryEngine.geodesicLength(this._polyline, "meters");

        let sd: string = undefined;
        let sm: string = undefined;

        if (dist < 500) {
            sd = this._roundNumber(dist, 0);
            sm = this._roundNumber(dist / 2, 0);
            this.unit = "m";
        }
        if (dist >= 500) {
            //greater then a km so convert to kms
            dist = dist / 1000;
            sd = this._roundNumber(dist, 1);
            sm = this._roundNumber(dist / 2, 1);
            this.unit = "km";
        }

        this.end = sd;
        this.middle = sm;

    }

    private _roundNumber(value: number, decimalPlaces: number): string {
        let val = value.toFixed(decimalPlaces);
        //remove trailing 0's 
        val = val.replace(/0+$/, '');
        if (val.endsWith(".")) val = val.replace(".", "");
        return val;
    }

}