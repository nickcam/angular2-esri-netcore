
import Accessor from 'esri/core/Accessor';
import Graphic from 'esri/Graphic';
import MapView from 'esri/views/MapView';
import SceneView from 'esri/views/SceneView';
import Color from 'esri/Color';
import geometryEngine from 'esri/geometry/geometryEngine';
import Polyline from 'esri/geometry/Polyline';
import Polygon from 'esri/geometry/Polygon';
import Circle from 'esri/geometry/Circle';
import Extent from 'esri/geometry/Extent';
import Point from 'esri/geometry/Point';
import Multipoint from 'esri/geometry/Multipoint';
import ScreenPoint from 'esri/geometry/ScreenPoint';
import SimpleFillSymbol from 'esri/symbols/SimpleFillSymbol';
import SimpleLineSymbol from 'esri/symbols/SimpleLineSymbol';
import TextSymbol from 'esri/symbols/TextSymbol';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import asd from 'esri/core/accessorSupport/decorators';

import Evented from 'esri/core/Evented';

export interface DrawToolProperties {

    drawingPolygonSymbol?: SimpleFillSymbol;
    drawingPolylineSymbol?: SimpleLineSymbol;

    completePolygonSymbol?: SimpleFillSymbol;
    completePolylineSymbol?: SimpleLineSymbol;

    textSymbol?: TextSymbol;

    displayTooltips?: boolean;

    addCompletedToGraphicsLayer?: boolean;
    tooltipConstantPosition?: DrawToolsTooltipPosition;
}

/**
 * Extend Accessor so properties can be watched if wanted. Add Evented as mixin so we can emit an event when drawing is complete.
 */
@asd.subclass("DrawTools")
export class DrawTools extends asd.declared(Accessor, Evented) {

    //add the Evented functions as properties so typescript is happy using it. There's probably better ways to include a mixin's properties?
    emit: (eventName: string, event: any) => Function;
    on: (eventName: string, Function) => Function;

    @asd.property()
    drawingPolygonSymbol: SimpleFillSymbol;

    @asd.property()
    drawingPolylineSymbol: SimpleLineSymbol;

    @asd.property()
    completePolygonSymbol: SimpleFillSymbol;

    @asd.property()
    completePolylineSymbol: SimpleLineSymbol;

    @asd.property()
    textSymbol: TextSymbol;

    @asd.property()
    ready: boolean = false;

    @asd.property()
    view: MapView | SceneView;

    @asd.property()
    isDrawing: boolean;

    @asd.property()
    displayTooltips: boolean;

    @asd.property()
    addCompletedToGraphicsLayer: boolean;

    private _graphicsLayer: GraphicsLayer;
    private _removedHandlers: any[] = [];
    private _addedHandles: IHandle[] = [];

    //graphic to display a polyline while one is being drawn
    private _tempGraphic: Graphic;

    tooltipConstantPosition: DrawToolsTooltipPosition;
    private _tooltip: DrawToolsTooltip;

    private _drawStarted: boolean;
    private _drawClickCount: number = 0;

    private _textInput: HTMLInputElement;
    private _textInputKeyUpHandlerCreated: boolean;

    constructor(view: MapView | SceneView, properties?: DrawToolProperties) {
        super();

        this.view = view;
        //create a graphicsLayer and add it to the map, when the layer loaded set the ready flag
        this._graphicsLayer = new GraphicsLayer();
        this.view.map.add(this._graphicsLayer);

        this._graphicsLayer.then(() => {
            this.set("ready", true);
        });

        if (!properties) properties = {};

        //default the symbology if not set
        this.drawingPolylineSymbol = properties.drawingPolylineSymbol || new SimpleLineSymbol({
            color: new Color([200, 0, 0]),
            width: 2,
        });

        this.drawingPolygonSymbol = properties.drawingPolygonSymbol || new SimpleFillSymbol({
            outline: this.drawingPolylineSymbol
        });

        this.completePolylineSymbol = properties.drawingPolylineSymbol || new SimpleLineSymbol({
            color: new Color([0, 0, 255]),
            width: 2,
        });

        this.completePolygonSymbol = properties.drawingPolygonSymbol || new SimpleFillSymbol({
            outline: this.completePolylineSymbol
        });

        this.textSymbol = properties.textSymbol || new TextSymbol({
            color: new Color([0, 0, 0]),
            font: {
                size: 12,
                family: "arial"
            }
        });

        // default to true. If false this class won't add the completed graphics to it's own grpahics layer. It will be up to the caller to receive the graphic and display however it wants after draw-complete is finished. 
        this.addCompletedToGraphicsLayer = properties.addCompletedToGraphicsLayer === false ? false : true;

        this.displayTooltips = properties.displayTooltips === false ? false : true; //default to true

        // always create a tooltip - so it can be hidden and displayed on demand whenever.
        this._tooltip = new DrawToolsTooltip();
        this.tooltipConstantPosition = properties.tooltipConstantPosition;
        this._tooltip.constantPosition = this.tooltipConstantPosition;

        // setup the text input for adding text to map. Use a text input so that mobile devices popup a keyboard
        this._textInput = document.createElement("input");
        this._textInput.style.position = "absolute";
        this._textInput.style.display = "none";
        this._textInput.style.zIndex = "1000";
        let container: any = this.view.container;
        container.appendChild(this._textInput);
    }

    /**
     * Convenience method to start drawing by just passing in the type of object to draw.
     * @param type - allowed values - 'freehand-polyline', 'polyline', 'freehand-polygon', 'polygon', 'rectangle'
     */
    draw(type: string, completeSymbol?: SimpleLineSymbol | SimpleFillSymbol | TextSymbol) {
        switch (type) {
            case "freehand-polyline":
                this.freehandPolyline(<SimpleLineSymbol>completeSymbol);
                return;
            case "polyline":
                this.polyline(<SimpleLineSymbol>completeSymbol);
                return;
            case "freehand-polygon":
                this.freehandPolygon(<SimpleFillSymbol>completeSymbol);
                return;
            case "polygon":
                this.polygon(<SimpleFillSymbol>completeSymbol);
                return;
            case "rectangle":
                this.rectangle(<SimpleFillSymbol>completeSymbol);
                return;
            case "circle":
                this.circle(<SimpleFillSymbol>completeSymbol);
                return;
            case "text":
                this.text(<TextSymbol>completeSymbol);
                return;
        }

        console.warn(`drawTools: ${type} is not a valid drawing type.`);
    }

    /**
    * Write some text on the map
    */
    text(completeSymbol?: TextSymbol) {

        let symbolBase = completeSymbol || this.textSymbol;
        let symbol = symbolBase.clone();

        this._prepareDraw(["drag", "doubleclick"]);

        this._tooltip.position(this._getTooltipPosFromMouse({ x: 0, y: 0 })).text(DrawToolsTooltip.TEXT);

        this._textInput.value = "";
        let firstPress = true;

        let down = this.view.on("pointer-down", (evt) => {
            try {
                let mp = this._toMapPoint(evt.x, evt.y);
                if (!mp) {
                    //somthing went wrong, couldn't get a map point
                    return;
                }

                if (firstPress) {
                    this._tempGraphic = new Graphic({
                        geometry: mp,
                        symbol: symbol,
                        attributes: { drawType: 'Text' }
                    });

                    this._graphicsLayer.add(this._tempGraphic);
                }

                this._tempGraphic.geometry = mp;

                if (this.displayTooltips) {
                    this._tooltip.position(this._getTooltipPosFromMouse(evt)).text(DrawToolsTooltip.TEXT);
                }

                this._textInput.style.display = "block";
                this._textInput.style.left = evt.x + "px";
                this._textInput.style.top = evt.y + "px";
                setTimeout(() => {
                    this._textInput.focus();
                }, 100);

                if (firstPress && !this._textInputKeyUpHandlerCreated) {
                    this._textInputKeyUpHandlerCreated = true;
                    // setup an event handler to read enter key on text box
                    this._textInput.addEventListener("keyup", (ev) => {

                        if (ev.key === "Enter" || ev.code === "Enter" || ev.keyCode === 13) {
                            if (!this._textInput.value) {
                                this._drawComplete();
                                return;
                            }

                            // enter was pressed so finish off text writing by adding a graphic containing what was in the text box.
                            let sym = <TextSymbol>this._tempGraphic.symbol;
                            sym.text = this._textInput.value;
                            sym.verticalAlignment = "top";
                            sym.horizontalAlignment = "left";

                            this._drawComplete(this._tempGraphic);
                        }
                    });

                }

                firstPress = false;

            }
            catch (err) {
                this._handleError(err);
            }
        });
        this._addedHandles.push(down);



    }

    /**
     * draw a freehand polyline.
     * @param completeSymbol - The symbol to use on the graphic when drawing is complete.
     */
    freehandPolyline(completeSymbol?: SimpleLineSymbol) {

        this._prepareDraw(["drag"]);
        this._tooltip.hide();

        // subscribe to pointer down to start the drawing process
        let down = this.view.on("pointer-down", (evt) => {

            try {
                this._drawStarted = true;

                //pointer is down so create a new polyline and add it to the graphics layer
                let poly = new Polyline({
                    spatialReference: this.view.spatialReference
                });

                let mp = this._toMapPoint(evt.x, evt.y);
                if (!mp) {
                    //somthing went wrong, couldn't get a map point
                    return;
                }

                //add the first point of the first path as the mouse down point
                poly.addPath([[mp.x, mp.y]]);
                this._tempGraphic = new Graphic({
                    geometry: poly,
                    symbol: this.drawingPolylineSymbol,
                    attributes: { drawType: 'Freehand polyline' }
                });
                this._graphicsLayer.add(this._tempGraphic);

                if (this.displayTooltips) {
                    this._tooltip.position(this._getTooltipPosFromMouse(evt)).text(DrawToolsTooltip.DRAG_TEXT);
                }
            }
            catch (err) {
                this._handleError(err);
            }

        });
        this._addedHandles.push(down);


        // assign the move event to track where we should draw the polyline
        let move = this.view.on("pointer-move", (evt) => {
            try {
                if (this._drawStarted) {
                    this._drawFreehandPolyline(evt);
                }
                else {
                    if (this.displayTooltips) {
                        this._tooltip.position(this._getTooltipPosFromMouse(evt)).text(DrawToolsTooltip.DRAG_TEXT);
                    }
                }
            }
            catch (err) {
                this._handleError(err);
            }
        });
        this._addedHandles.push(move);


        // catch pointer up to finish the drawing
        let up = this.view.on("pointer-up", (evt) => {
            try {
                this._drawComplete(this._tempGraphic);
            }
            catch (err) {
                this._handleError(err);
            }
        });
        this._addedHandles.push(up);
    }


    polyline(completeSymbol?: SimpleLineSymbol) {

        this._prepareDraw(["drag", "doubleclick"]);
        let firstDown = true;
        let pointerDown = false;

        // subscribe to pointer down to start the drawing process
        let down = this.view.on("pointer-down", (evt) => {

            try {
                // use a timeout to throttle setting pointerDown, this is to attempt to make it not get set when double clicking to complete the drawing.
                setTimeout(() => {
                    pointerDown = true;
                }, 250);

                if (firstDown) {

                    this._drawStarted = true;
                    this._tooltip.hide();

                    // pointer is down so create a new polyline and add it to the graphics layer
                    let poly = new Polyline({
                        spatialReference: this.view.spatialReference
                    });

                    let mp = this._toMapPoint(evt.x, evt.y);
                    if (!mp) {
                        // something went wrong, couldn't get a map point
                        return;
                    }

                    // add the first point of the first path as the mouse down point
                    poly.addPath([[mp.x, mp.y]]);

                    this._tempGraphic = new Graphic({
                        geometry: poly,
                        symbol: this.drawingPolylineSymbol,
                        attributes: { drawType: 'Polyline' }
                    });
                    this._graphicsLayer.add(this._tempGraphic);
                    firstDown = false;

                    if (this.displayTooltips) {
                        this._tooltip.position(this._getTooltipPosFromMouse(evt)).text(DrawToolsTooltip.DRAG_DRAW_VERTEX_START_TEXT);
                    }
                }

            }
            catch (err) {
                this._handleError(err);
            }

        });
        this._addedHandles.push(down);

        // assign the move event to track where we should draw the polyline
        let move = this.view.on("pointer-move", (evt) => {
            try {
                if (this._drawStarted && pointerDown) {
                    console.log('pointer move');
                    this._drawPolyline(evt);
                }
                else {
                    if (this.displayTooltips) {
                        this._tooltip.position(this._getTooltipPosFromMouse(evt));
                        if (firstDown) {
                            this._tooltip.text(DrawToolsTooltip.DRAG_DRAW_VERTEX_START_TEXT);
                        }
                        else {
                            this._tooltip.text(DrawToolsTooltip.DRAG_DRAW_VERTEX_CONTINUE_TEXT);
                        }
                    }
                }
            }
            catch (err) {
                this._handleError(err);
            }
        });
        this._addedHandles.push(move);

        // catch pointer up to finish drawing a vertice
        let up = this.view.on("pointer-up", (evt) => {
            try {

                if (!pointerDown) return;
                pointerDown = false;

                // we've hit pointer up so add the current point to the end of the path
                let mp = this._toMapPoint(evt.x, evt.y);
                if (!mp) {
                    // something went wrong, couldn't get a map point
                    return;
                }

                let polyline = <Polyline>this._tempGraphic.geometry;
                polyline.paths[0].push([mp.x, mp.y]);

                if (this.displayTooltips) {
                    this._tooltip.position(this._getTooltipPosFromMouse(evt)).text(DrawToolsTooltip.DRAG_DRAW_VERTEX_CONTINUE_TEXT);
                }

            }
            catch (err) {
                this._handleError(err);
            }
        });
        this._addedHandles.push(up);

        // complete drawing on double click
        let doubleClick = this.view.on("double-click", (evt) => {
            try {
                // exit if not left mouse button or touch event
                if (evt.button !== 0) return;

                this._drawComplete(this._tempGraphic);
            }
            catch (err) {
                this._handleError(err);
            }
        });
        this._addedHandles.push(doubleClick);

    }


    /**
     * draw a freehand polyline.
     * @param completeSymbol - The symbol to use on the graphic when drawing is complete.
     */
    freehandPolygon(completeSymbol?: SimpleFillSymbol) {

        this._prepareDraw(["drag"]);

        //subscribe to pointer down to start the drawing process
        let down = this.view.on("pointer-down", (evt) => {
            try {

                this._drawStarted = true;
                this._tooltip.hide();

                //pointer is down so create a new polygon and add it to the graphics layer
                let poly = new Polygon({
                    spatialReference: this.view.spatialReference
                });

                let mp = this._toMapPoint(evt.x, evt.y);
                if (!mp) {
                    //somthing went wrong, couldn't get a map point
                    return;
                }

                //add the first point of the first path as the mouse down point
                poly.addRing([[mp.x, mp.y]]);
                this._tempGraphic = new Graphic({
                    geometry: poly,
                    symbol: this.drawingPolygonSymbol,
                    attributes: { drawType: 'Freehand polygon' }
                });
                this._graphicsLayer.add(this._tempGraphic);

            }
            catch (err) {
                this._handleError(err);
            }
        });
        this._addedHandles.push(down);

        //assign the move event to track where we should draw the polyline
        let move = this.view.on("pointer-move", (evt) => {
            try {
                if (this._drawStarted) {
                    this._drawFreehandPolygon(evt);
                }
                else {
                    //haven't started drawing so display the tooltip and set text
                    if (this.displayTooltips) {
                        this._tooltip.position(this._getTooltipPosFromMouse(evt)).text(DrawToolsTooltip.DRAG_TEXT);
                    }
                }
            }
            catch (err) {
                this._handleError(err);
            }
        });
        this._addedHandles.push(move);

        //catch pointer up to finish the drawing
        let up = this.view.on("pointer-up", (evt) => {
            try {
                //add the first point of the ring to the end to complete the polygon
                let poly = <Polygon>this._tempGraphic.geometry;
                let firstPoint = poly.rings[0][0];
                poly.rings[0].push([firstPoint[0], firstPoint[1]]);

                this._drawComplete(this._tempGraphic);
            }
            catch (err) {
                this._handleError(err);
            }
        });

        this._addedHandles.push(up);
    }


    polygon(completeSymbol?: SimpleFillSymbol) {

        this._prepareDraw(["drag", "doubleclick"]);
        let firstDown = true;
        let pointerDown = false;

        // subscribe to pointer down to start the drawing process
        let down = this.view.on("pointer-down", (evt) => {

            try {
                // use a timeout to throttle setting pointerDown, this is to attempt to make it not get set when double clicking to complete the drawing.
                setTimeout(() => {
                    pointerDown = true;
                }, 250);

                if (firstDown) {

                    this._drawStarted = true;
                    this._tooltip.hide();

                    // pointer is down so create a new polyline and add it to the graphics layer
                    let poly = new Polygon({
                        spatialReference: this.view.spatialReference
                    });

                    let mp = this._toMapPoint(evt.x, evt.y);
                    if (!mp) {
                        // something went wrong, couldn't get a map point
                        return;
                    }

                    // add the first point of the first path as the mouse down point
                    poly.addRing([[mp.x, mp.y]]);

                    this._tempGraphic = new Graphic({
                        geometry: poly,
                        symbol: this.drawingPolygonSymbol,
                        attributes: { drawType: 'Polygon' }
                    });
                    this._graphicsLayer.add(this._tempGraphic);
                    firstDown = false;

                    if (this.displayTooltips) {
                        this._tooltip.position(this._getTooltipPosFromMouse(evt)).text(DrawToolsTooltip.DRAG_DRAW_VERTEX_START_TEXT);
                    }
                }

            }
            catch (err) {
                this._handleError(err);
            }

        });
        this._addedHandles.push(down);

        // assign the move event to track where we should draw the polyline
        let move = this.view.on("pointer-move", (evt) => {
            try {
                if (this._drawStarted && pointerDown) {
                    this._drawPolygon(evt);
                }
                else {
                    if (this.displayTooltips) {
                        this._tooltip.position(this._getTooltipPosFromMouse(evt));
                        if (firstDown) {
                            this._tooltip.text(DrawToolsTooltip.DRAG_DRAW_VERTEX_START_TEXT);
                        }
                        else {
                            this._tooltip.text(DrawToolsTooltip.DRAG_DRAW_VERTEX_CONTINUE_TEXT);
                        }
                    }
                }
            }
            catch (err) {
                this._handleError(err);
            }
        });
        this._addedHandles.push(move);

        // catch pointer up to finish drawing a vertice
        let up = this.view.on("pointer-up", (evt) => {
            try {

                if (!pointerDown) return;
                pointerDown = false;

                // we've hit pointer up so add the current point to the end of the path
                let mp = this._toMapPoint(evt.x, evt.y);
                if (!mp) {
                    // something went wrong, couldn't get a map point
                    return;
                }

                let polygon = <Polygon>this._tempGraphic.geometry;
                polygon.rings[0].push([mp.x, mp.y]);

                if (this.displayTooltips) {
                    this._tooltip.position(this._getTooltipPosFromMouse(evt)).text(DrawToolsTooltip.DRAG_DRAW_VERTEX_CONTINUE_TEXT);
                }
            }
            catch (err) {
                this._handleError(err);
            }
        });
        this._addedHandles.push(up);

        // complete drawing on double click
        let doubleClick = this.view.on("double-click", (evt) => {
            try {
                // exit if not left mouse button or touch event
                if (evt.button !== 0) return;

                this._drawComplete(this._tempGraphic);
            }
            catch (err) {
                this._handleError(err);
            }
        });
        this._addedHandles.push(doubleClick);

    }


    private _rectMultipoint: Multipoint;
    /**
    * draw a rectangle
    * @param completeSymbol - The symbol to use on the graphic when drawing is complete.
    */
    rectangle(completeSymbol?: SimpleFillSymbol) {

        this._prepareDraw(["drag"]);

        // subscribe to pointer down to start the drawing process
        let down = this.view.on("pointer-down", (evt) => {
            try {

                this._drawStarted = true;
                this._tooltip.hide();

                // using a polygon to draw the rectangle
                let poly = new Polygon({
                    spatialReference: this.view.spatialReference
                });

                let mp = this._toMapPoint(evt.x, evt.y);
                if (!mp) {
                    // something went wrong, couldn't get a map point
                    return;
                }
                poly.addRing([mp]);

                // use a multipoint to easily calculate the bounds of the rectangle
                this._rectMultipoint = new Multipoint({
                    spatialReference: this.view.spatialReference
                });
                this._rectMultipoint.addPoint(mp);

                this._tempGraphic = new Graphic({
                    geometry: poly,
                    symbol: this.drawingPolygonSymbol,
                    attributes: { drawType: 'Rectangle' }
                });
                this._graphicsLayer.add(this._tempGraphic);

            }
            catch (err) {
                this._handleError(err);
            }
        });
        this._addedHandles.push(down);

        // assign the move event to track where we should draw the polyline
        let move = this.view.on("pointer-move", (evt) => {
            try {
                if (this._drawStarted) {
                    this._drawRectangle(evt);
                }
                else {
                    // haven't started drawing so display the tooltip and set text
                    if (this.displayTooltips) {
                        this._tooltip.position(this._getTooltipPosFromMouse(evt)).text(DrawToolsTooltip.DRAG_TEXT);
                    }
                }
            }
            catch (err) {
                this._handleError(err);
            }
        });
        this._addedHandles.push(move);

        // catch pointer up to finish the drawing
        let up = this.view.on("pointer-up", (evt) => {
            try {
                // add the first point of the ring to the end to complete the polygon
                this._drawComplete(this._tempGraphic);
            }
            catch (err) {
                this._handleError(err);
            }
        });

        this._addedHandles.push(up);
    }

    /**
   * draw a circle
   * @param completeSymbol - The symbol to use on the graphic when drawing is complete.
   */
    circle(completeSymbol?: SimpleFillSymbol) {

        this._prepareDraw(["drag"]);

        // subscribe to pointer down to start the drawing process
        let down = this.view.on("pointer-down", (evt) => {
            try {

                this._drawStarted = true;
                this._tooltip.hide();

                let mp = this._toMapPoint(evt.x, evt.y);
                if (!mp) {
                    // somthing went wrong, couldn't get a map point
                    return;
                }

                // create a new circle with the sleected point as the center
                let circle = new Circle({
                    spatialReference: this.view.spatialReference,
                    center: mp,
                    radius: 1,
                    radiusUnit: "meters"
                });

                // use a multipoint to easily calculate the bounds of the rectangle
                this._tempGraphic = new Graphic({
                    geometry: circle,
                    symbol: this.drawingPolygonSymbol,
                    attributes: { drawType: 'Circle' }
                });
                this._graphicsLayer.add(this._tempGraphic);

            }
            catch (err) {
                this._handleError(err);
            }
        });
        this._addedHandles.push(down);

        // assign the move event to track where we should draw the polyline
        let move = this.view.on("pointer-move", (evt) => {
            try {
                if (this._drawStarted) {
                    this._drawCircle(evt);
                }
                else {
                    // haven't started drawing so display the tooltip and set text
                    if (this.displayTooltips) {
                        this._tooltip.position(this._getTooltipPosFromMouse(evt)).text(DrawToolsTooltip.DRAG_TEXT);
                    }
                }
            }
            catch (err) {
                this._handleError(err);
            }
        });
        this._addedHandles.push(move);

        // catch pointer up to finish the drawing
        let up = this.view.on("pointer-up", (evt) => {
            try {
                // add the first point of the ring to the end to complete the polygon
                this._drawComplete(this._tempGraphic);
            }
            catch (err) {
                this._handleError(err);
            }
        });

        this._addedHandles.push(up);
    }


    /**
     * Clear all of the drawn graphics
     */
    clear() {
        this._graphicsLayer.removeAll();
    }


    remove(graphic: Graphic) {
        this._graphicsLayer.remove(graphic);

    }

    cancelDraw() {
        if (this.isDrawing) {
            this._drawComplete();
        }
    }

    private _drawPolyline(evt) {
        let mp = this._toMapPoint(evt.x, evt.y);
        if (!mp) {
            // couldn't get a map point, so exit           
            return;
        }

        let poly = <Polyline>this._tempGraphic.geometry;
        let lastPathIndex = poly.paths[0].length - 1;

        if (poly.paths[0].length === 1) {
            // add the map point to the first path of the geometry as there's only one point in there right now
            poly.paths[0].push([mp.x, mp.y]);
        }
        else {
            // replace the last point in the path with this point
            poly.paths[0][lastPathIndex] = [mp.x, mp.y];
        }

        // have to remove and re-add the graphic for it to show up. This sucks a bit.
        this._graphicsLayer.remove(this._tempGraphic);

        this._tempGraphic = new Graphic({
            geometry: poly,
            symbol: this.drawingPolylineSymbol,
            attributes: this._tempGraphic.attributes
        });
        this._graphicsLayer.add(this._tempGraphic);

    }

    private _drawFreehandPolyline(evt) {

        let mp = this._toMapPoint(evt.x, evt.y);
        if (!mp) {
            // couldn't get a map point, so exit
            return;
        }

        let poly = <Polyline>this._tempGraphic.geometry;
        let lastPathIndex = poly.paths[0].length - 1;

        if (mp.x === poly.paths[0][lastPathIndex][0] && mp.y === poly.paths[0][lastPathIndex][1]) {
            return; // this point is the same as the last one in the path, so no need to add anything to it.
        }

        // add the map point to the first path of the geometry
        poly.paths[0].push([mp.x, mp.y]);

        // have to remove and re-add the graphic for it to show up. This sucks a bit.
        this._graphicsLayer.remove(this._tempGraphic);

        this._tempGraphic = new Graphic({
            geometry: poly,
            symbol: this.drawingPolylineSymbol,
            attributes: this._tempGraphic.attributes
        });
        this._graphicsLayer.add(this._tempGraphic);

    }

    private _drawFreehandPolygon(evt) {
        let mp = this._toMapPoint(evt.x, evt.y);
        if (!mp) {
            // couldn't get a map point, so exit
            return;
        }

        let poly = <Polygon>this._tempGraphic.geometry;
        let lastRingIndex = poly.rings[0].length - 1;

        if (mp.x === poly.rings[0][lastRingIndex][0] && mp.y === poly.rings[0][lastRingIndex][1]) {
            return; // this point is the same as the last one in the path, so no need to add anything to it.
        }

        // add the map point to the first path of the geometry
        poly.rings[0].push([mp.x, mp.y]);

        // have to remove and re-add the graphic for it to show up. This sucks a bit.
        this._graphicsLayer.remove(this._tempGraphic);

        this._tempGraphic = new Graphic({
            geometry: poly,
            symbol: this.drawingPolygonSymbol,
            attributes: this._tempGraphic.attributes
        });
        this._graphicsLayer.add(this._tempGraphic);

    }

    private _drawPolygon(evt) {
        let mp = this._toMapPoint(evt.x, evt.y);
        if (!mp) {
            // couldn't get a map point, so exit
            return;
        }

        let poly = <Polygon>this._tempGraphic.geometry;
        let lastRingIndex = poly.rings[0].length - 1;

        if (poly.rings[0].length === 1) {
            // add the map point to the first path of the geometry as there's only one point in there right now
            poly.rings[0].push([mp.x, mp.y]);
        }
        else {
            // replace the last point in the path with this point
            poly.rings[0][lastRingIndex] = [mp.x, mp.y];
        }

        // have to remove and re-add the graphic for it to show up. This sucks a bit.
        this._graphicsLayer.remove(this._tempGraphic);

        this._tempGraphic = new Graphic({
            geometry: poly,
            symbol: this.drawingPolygonSymbol,
            attributes: this._tempGraphic.attributes
        });
        this._graphicsLayer.add(this._tempGraphic);

    }

    private _drawRectangle(evt) {
        let mp = this._toMapPoint(evt.x, evt.y);
        if (!mp) {
            // couldn't get a map point, so exit           
            return;
        }

        // replace or add the point at index 1
        if (this._rectMultipoint.points.length > 1) {
            this._rectMultipoint.removePoint(1);
        }
        this._rectMultipoint.addPoint(mp);

        let poly = <Polygon>this._tempGraphic.geometry;
        let ring = poly.rings[0];

        // use the extent of the multipoint to easily get the map points for the rectangle...
        // but use a polygon to contain the points and actually draw it, this works when drawing over the international date line.
        let e = this._rectMultipoint.extent;
        ring = [];
        ring.push([e.xmin, e.ymax]);
        ring.push([e.xmin, e.ymin]);
        ring.push([e.xmax, e.ymin]);
        ring.push([e.xmax, e.ymax]);
        ring.push([e.xmin, e.ymax]);

        poly.rings[0] = ring;

        // have to remove and re-add the graphic for it to show up. This sucks a bit.
        this._graphicsLayer.remove(this._tempGraphic);
        this._tempGraphic = new Graphic({
            geometry: poly,
            symbol: this.drawingPolygonSymbol,
            attributes: this._tempGraphic.attributes
        });
        this._graphicsLayer.add(this._tempGraphic);

    }

    private _drawCircle(evt) {
        let mp = this._toMapPoint(evt.x, evt.y);
        if (!mp) {
            // couldn't get a map point, so exit           
            return;
        }

        let circle = <Circle>this._tempGraphic.geometry;
        let cp = <Point>circle.center;

        // get the distance between the center point and current point in meters and set the radius of the circle. Just doing planar calcs...could add a separate geodesic circle though.
        let dist = geometryEngine.distance(<Point>circle.center, mp, "meters");

        let newCircle = new Circle({
            center: cp,
            radius: dist,
            radiusUnit: "meters"
        });

        // have to remove and re-add the graphic for it to show up. This sucks a bit.
        this._graphicsLayer.remove(this._tempGraphic);
        this._tempGraphic = new Graphic({
            geometry: newCircle,
            symbol: this.drawingPolygonSymbol,
            attributes: this._tempGraphic.attributes
        });
        this._graphicsLayer.add(this._tempGraphic);

    }



    private _prepareDraw(removeEvents?: string[]) {
        if (this._tempGraphic) {
            this._graphicsLayer.remove(this._tempGraphic);
            this._tempGraphic = null;
        }

        this._drawClickCount = 0;
        this._tooltip.hide();
        if (this.displayTooltips) {
            this._tooltip.attachToView(this.view);
        }


        this._drawStarted = false;
        this.isDrawing = true;

        // Make the drawTools graphics layer the highest in the layer order.
        this.view.map.reorder(this._graphicsLayer, this.view.map.allLayers.length - 1);

        this._clearAddedHandlers();
        this._removedHandlers = [];

        // Disable map navigation if we want to remove some while drawing. There must be a better way of doing this though.
        // clear the view handlers from input manager - different child property depending on view type.    
        if (removeEvents) {
            let im = this.view["inputManager"];
            let handlers = this.view.type === "3d" ? im.viewEvents.inputManager._handlers : im._handlers;
            this._disableHandlers(handlers, removeEvents);
        }

    }


    private _disableHandlers(handlers: any[], removeEvents: string[]) {
        for (let h of handlers) {
            if (h.handler._name.startsWith("recognizers")) continue; //leave the recognizer handlers alone
            let name = this._getLastPartHandlerName(h.handler._name);

            // loop the remove events and get rid of any that are contained in the removeEvents array
            for (let r of removeEvents) {
                if (name.indexOf(r) !== -1) {
                    this._removedHandlers.push(h);
                    h.removed = true;
                }
            }
        }
    }

    private _getLastPartHandlerName(name: string) {
        let index = name.lastIndexOf(".");
        if (index === -1) return name.toLowerCase();
        return name.substring(index + 1).toLowerCase();
    }

    private _drawComplete(graphic?: Graphic) {

        this._drawStarted = false;
        this.isDrawing = false;
        this._tooltip.hide();

        this._textInput.style.display = "none";
        this._textInput.value = "";

        this._clearAddedHandlers();

        // re-add the removed view handlers into the input manager to reenable navigation
        if (this._removedHandlers.length > 0) {
            let im = this.view["inputManager"];
            let handlers = this.view.type === "3d" ? im.viewEvents.inputManager._handlers : im._handlers;
            for (let rh of this._removedHandlers) {
                rh.removed = false;
                handlers.push(rh);
            }
        }


        // finalise the graphic if one has been passed in
        if (!graphic) {
            if (this._tempGraphic) {
                this._graphicsLayer.remove(this._tempGraphic);
            }

            return; // no graphic just return
        }

        // simplify the geometry
        let simpleGeometry = geometryEngine.simplify(graphic.geometry);

        let symbol = undefined;
        switch (graphic.attributes.drawType) {
            case "Polyline":
            case "Freehand polyline":
                symbol = this.completePolylineSymbol;
                break;
            case "Text":
                symbol = graphic.symbol;
                break;
            default:
                symbol = this.completePolygonSymbol;
        }

        // create a new graphic and remove the temp drawing one.
        let completedGraphic = new Graphic({
            geometry: simpleGeometry,
            symbol: symbol,
            attributes: graphic.attributes
        });

        this._graphicsLayer.remove(graphic);

        if (this.addCompletedToGraphicsLayer) {
            this._graphicsLayer.add(completedGraphic);
        }

        this.emit("draw-complete", completedGraphic);
    }

    private _toMapPoint(x: number, y: number): Point {
        return this.view.toMap(new ScreenPoint({ x: x, y: y }));
    }

    private _clearAddedHandlers() {
        // remove any custom handles that have been added
        for (let h of this._addedHandles) {
            h.remove();
        }

        // Reset the handles array
        this._addedHandles = [];
    }

    private _handleError(err) {
        this._drawComplete();
        console.error(err);
    }

    private _getTooltipPosFromMouse(evt): DrawToolsTooltipPosition {
        let left = evt.x + 30;
        let top = evt.y - 55;
        return {
            left: left + "px",
            top: top + "px"
        };
    }
}

class DrawToolsTooltip {

    public static DRAG_TEXT: string = "Press down to start and let go to complete.";

    public static DRAG_DRAW_VERTEX_START_TEXT: string = "Press down to start and let go to complete a vertex.";
    public static DRAG_DRAW_VERTEX_CONTINUE_TEXT: string = "Press down to add a new vertex or double click to complete.";

    public static TEXT: string = "Press on the map to position text. Write text in box. Press ENTER to complete.";

    element: HTMLElement;
    view: MapView | SceneView;

    constantPosition?: DrawToolsTooltipPosition;
    constructor() {

        // set up the element
        this.element = document.createElement("div");
        this.element.classList.add("draw-tools-tooltip"); // add a class so custom styles can be applied in css if desired

        // add some default styles
        let style = this.element.style;
        style.backgroundColor = "#FFF";
        style.position = "absolute";
        style.padding = "3px 5px";
        style.zIndex = "2000";
        style.border = "1px Solid #000";
        style.maxWidth = "200px";
        style.display = "none";
        style.msUserSelect = "none";
        style.webkitUserSelect = "none";

    }

    attachToView(view: MapView | SceneView) {
        this.view = view;
        // attach to the passed in view's container
        let container: any = view.container;
        container.appendChild(this.element);
        return this;
    }

    hide() {
        this.element.style.display = "none";
        return this;
    }

    position(position?: DrawToolsTooltipPosition) {
        this.element.style.display = "block";
        let pos = this.constantPosition ? this.constantPosition : position; // use constant position if set or the passed in position if not

        if (pos.bottom) this.element.style.bottom = pos.bottom;
        if (pos.top) this.element.style.top = pos.top;
        if (pos.left) this.element.style.left = pos.left;
        if (pos.right) this.element.style.right = pos.right;
        return this;
    }
     
    text(text: string) {
        this.element.innerHTML = text;
        return this;
    }


}

export interface DrawToolsTooltipPosition {
    left?: string;
    top?: string;
    bottom?: string;
    right?: string;
}