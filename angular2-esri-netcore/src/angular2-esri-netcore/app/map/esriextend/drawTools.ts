
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
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import asd from 'esri/core/accessorSupport/decorators';

import Evented from 'esri/core/Evented';

export interface DrawToolProperties {

    drawingPolygonSymbol?: SimpleFillSymbol;
    drawingPolylineSymbol?: SimpleLineSymbol;

    completePolygonSymbol?: SimpleFillSymbol;
    completePolylineSymbol?: SimpleLineSymbol;

    displayTooltips?: boolean;
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
    ready: boolean = false;

    @asd.property()
    view: MapView | SceneView;

    @asd.property()
    isDrawing: boolean;

    @asd.property()
    displayTooltips: boolean;

    get graphics(): Graphic[] {
        if (!this._graphicsLayer) return [];
        return this._graphicsLayer.graphics.toArray();
    }

    private _graphicsLayer: GraphicsLayer;
    private _removedHandlers: any[] = [];
    private _addedHandles: IHandle[] = [];

    //graphic to display a polyline while one is being drawn
    private _tempGraphic: Graphic;

    private _tooltip: DrawToolsTooltip;
    private _drawStarted: boolean;

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

        this.displayTooltips = properties.displayTooltips == false ? false : true; //default to true

        //always create a tooltip - so it can be hidden and displayed on demand whenever.
        this._tooltip = new DrawToolsTooltip();
    }

    /**
     * Convenience method to start drawing by just passing in the type of object to draw.
     * @param type - allowed values - 'freehand-polyline', 'polyline', 'freehand-polygon', 'polygon', 'rectangle'
     */
    draw(type: string, completeSymbol?: SimpleLineSymbol | SimpleFillSymbol) {
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

        }

        console.warn(`drawTools: ${type} is not a valid drawing type.`);
    }


    /**
     * draw a freehand polyline.
     * @param completeSymbol - The symbol to use on the graphic when drawing is complete.
     */
    freehandPolyline(completeSymbol?: SimpleLineSymbol) {

        this._prepareDraw(["drag"]);

        //subscribe to pointer down to start the drawing process
        let down = this.view.on("pointer-down", (evt) => {

            try {
                this._drawStarted = true;
                this._tooltip.hide();

                //pointer is down so create a new polyline and add it to the graphics layer
                let poly = new Polyline({
                    spatialReference: this.view.spatialReference
                });

                let mp = this._toMapPoint(evt.x, evt.y);
                if (!mp) {
                    //somthing went wrong, couldn't get a map point - could be outside of the view. call drawComplete and exit
                    this._drawComplete();
                    return;
                }

                //add the first point of the first path as the mouse down point
                poly.addPath([[mp.x, mp.y]]);
                this._tempGraphic = new Graphic({
                    geometry: poly,
                    symbol: this.drawingPolylineSymbol
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
                    this._drawFreehandPolyline(evt);
                }
                else {
                    if (this.displayTooltips) {
                        this._tooltip.position(evt.x, evt.y).text(DrawToolsTooltip.DRAG_TEXT);
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
                this._drawComplete(this._tempGraphic);
            }
            catch (err) {
                this._handleError(err);
            }
        });

        this._addedHandles.push(up);
    }


    polyline(completeSymbol?: SimpleLineSymbol) {

        this._prepareDraw(["doubleclick"]);

        let clickCount = 0;

        //subscribe to pointer down to start the drawing process
        let click = this.view.on("click", (evt) => {
            try {
                //exit if not a left mouse button - or touch event
                if (evt.button !== 0) return;
                let mp = evt.mapPoint;
                if (!mp) {
                    //somthing went wrong, couldn't get a map point - could be outside of the view. call drawComplete and exit
                    this._drawComplete();
                    return;
                }

                if (clickCount === 0) {

                    this._drawStarted = true;

                    //this is first click so set up the polyline

                    //Create a new polyline and add it to the graphics layer
                    let poly = new Polyline({
                        spatialReference: this.view.spatialReference
                    });

                    //add the first point of the first path as the mouse down point
                    poly.addPath([[mp.x, mp.y]]);
                    this._tempGraphic = new Graphic({
                        geometry: poly,
                        symbol: this.drawingPolylineSymbol
                    });
                    this._graphicsLayer.add(this._tempGraphic);

                }
                else {
                    //this is not the first click but a later one, so save the point the polyline
                    let poly = <Polyline>this._tempGraphic.geometry;
                    poly.paths[0].push([mp.x, mp.y]);
                }
                clickCount++;
            }
            catch (err) {
                this._handleError(err);
            }
        });
        this._addedHandles.push(click);

        //assign the move event to track where we should draw the polyline - only do this on the first click
        let move = this.view.on("pointer-move", (evt) => {
            try {
                if (this._drawStarted) {
                    this._drawPolyline(evt);

                    this._tooltip.position(evt.x, evt.y);
                    this._tooltip.text(clickCount === 1 ? DrawToolsTooltip.CLICK_DRAW_FIRSTCLICK_TEXT : DrawToolsTooltip.CLICK_DRAW_FINAL_TEXT);
                }
                else {
                    if (this.displayTooltips) {
                        this._tooltip.position(evt.x, evt.y).text(DrawToolsTooltip.CLICK_DRAW_PRECLICK_TEXT);
                    }
                }
            }
            catch (err) {
                this._handleError(err);
            }
        });
        this._addedHandles.push(move);


        let doubleClick = this.view.on("double-click", (evt) => {
            try {
                //exit if not left mouse button or touch event
                if (evt.button !== 0) return;

                //add the double clicked point to the poly
                let mp = evt.mapPoint;
                if (mp) {
                    let poly = <Polyline>this._tempGraphic.geometry;
                    poly.paths[0].push([mp.x, mp.y]);
                }

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
                    //somthing went wrong, couldn't get a map point - could be outside of the view. call drawComplete and exit
                    this._drawComplete();
                    return;
                }

                //add the first point of the first path as the mouse down point
                poly.addRing([[mp.x, mp.y]]);
                this._tempGraphic = new Graphic({
                    geometry: poly,
                    symbol: this.drawingPolygonSymbol
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
                        this._tooltip.position(evt.x, evt.y).text(DrawToolsTooltip.DRAG_TEXT);
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

        this._prepareDraw(["doubleclick"]);

        let clickCount = 0;

        //subscribe to pointer down to start the drawing process
        let click = this.view.on("click", (evt) => {
            try {
                //exit if not a left mouse button - or touch event
                if (evt.button !== 0) return;

                let mp = evt.mapPoint;
                if (!mp) {
                    //somthing went wrong, couldn't get a map point - could be outside of the view. call drawComplete and exit
                    this._drawComplete();
                    return;
                }

                if (clickCount === 0) {
                    //this is first click so set up the polyline
                    this._drawStarted = true;

                    //Create a new polyline and add it to the graphics layer
                    let poly = new Polygon({
                        spatialReference: this.view.spatialReference
                    });

                    //add the first point of the first path as the mouse down point
                    poly.addRing([[mp.x, mp.y]]);
                    this._tempGraphic = new Graphic({
                        geometry: poly,
                        symbol: this.drawingPolygonSymbol
                    });
                    this._graphicsLayer.add(this._tempGraphic);
                }
                else {
                    //this is not the first click but a later one, so save the point to the polygon
                    let poly = <Polygon>this._tempGraphic.geometry;
                    poly.rings[0].push([mp.x, mp.y]);
                }
                clickCount++;
            }
            catch (err) {
                this._handleError(err);
            }
        });
        this._addedHandles.push(click);

        //assign the move event to track where we should draw the polyline - only do this on the first click
        let move = this.view.on("pointer-move", (evt) => {
            try {
                if (this._drawStarted) {
                    this._drawPolygon(evt);

                    this._tooltip.position(evt.x, evt.y);
                    this._tooltip.text(clickCount === 1 ? DrawToolsTooltip.CLICK_DRAW_FIRSTCLICK_TEXT : DrawToolsTooltip.CLICK_DRAW_FINAL_TEXT);
                }
                else {
                    if (this.displayTooltips) {
                        this._tooltip.position(evt.x, evt.y).text(DrawToolsTooltip.CLICK_DRAW_PRECLICK_TEXT);
                    }
                }
            }
            catch (err) {
                this._handleError(err);
            }

        });
        this._addedHandles.push(move);


        let doubleClick = this.view.on("double-click", (evt) => {
            try {
                //exit if not left mouse button or touch event
                if (evt.button !== 0) return;

                //add the double clicked point to the poly
                let mp = evt.mapPoint;
                if (mp) {
                    let poly = <Polygon>this._tempGraphic.geometry;
                    poly.rings[0].push([mp.x, mp.y]);
                }

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

        //subscribe to pointer down to start the drawing process
        let down = this.view.on("pointer-down", (evt) => {
            try {

                this._drawStarted = true;
                this._tooltip.hide();

                //using a polygon to draw the rectangle
                let poly = new Polygon({
                    spatialReference: this.view.spatialReference
                });

                let mp = this._toMapPoint(evt.x, evt.y);
                if (!mp) {
                    //somthing went wrong, couldn't get a map point - could be outside of the view. call drawComplete and exit
                    this._drawComplete();
                    return;
                }
                poly.addRing([mp]);

                //use a multipoint to easily calculate the bounds of the rectangle
                this._rectMultipoint = new Multipoint({
                    spatialReference: this.view.spatialReference
                });
                this._rectMultipoint.addPoint(mp);

                this._tempGraphic = new Graphic({
                    geometry: poly,
                    symbol: this.drawingPolygonSymbol
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
                    this._drawRectangle(evt);
                }
                else {
                    //haven't started drawing so display the tooltip and set text
                    if (this.displayTooltips) {
                        this._tooltip.position(evt.x, evt.y).text(DrawToolsTooltip.DRAG_TEXT);
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

        //subscribe to pointer down to start the drawing process
        let down = this.view.on("pointer-down", (evt) => {
            try {

                this._drawStarted = true;
                this._tooltip.hide();

                let mp = this._toMapPoint(evt.x, evt.y);
                if (!mp) {
                    //somthing went wrong, couldn't get a map point - could be outside of the view. call drawComplete and exit
                    this._drawComplete();
                    return;
                }

                //create a new circle with the sleected point as the center
                let circle = new Circle({
                    spatialReference: this.view.spatialReference,
                    center: mp,
                    radius: 1,
                    radiusUnit: "meters"
                });

                //use a multipoint to easily calculate the bounds of the rectangle
                this._tempGraphic = new Graphic({
                    geometry: circle,
                    symbol: this.drawingPolygonSymbol
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
                    this._drawCircle(evt);
                }
                else {
                    //haven't started drawing so display the tooltip and set text
                    if (this.displayTooltips) {
                        this._tooltip.position(evt.x, evt.y).text(DrawToolsTooltip.DRAG_TEXT);
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

    cancelDraw() {
        if (this.isDrawing) {
            this._drawComplete();
        }
    }

    private _drawPolyline(evt) {
        let mp = this._toMapPoint(evt.x, evt.y);
        if (!mp) {
            //couldn't get a map point, so exit           
            return;
        }

        let poly = <Polyline>this._tempGraphic.geometry;
        let lastPathIndex = poly.paths[0].length - 1;

        if (poly.paths[0].length === 1) {
            //add the map point to the first path of the geometry as there's only one point in there right now
            poly.paths[0].push([mp.x, mp.y]);
        }
        else {
            //replace the last point in the path with this point
            poly.paths[0][lastPathIndex] = [mp.x, mp.y];
        }

        //have to remove and re-add the graphic for it to show up. This sucks a bit.
        this._graphicsLayer.remove(this._tempGraphic);

        this._tempGraphic = new Graphic({ 
            geometry: poly,
            symbol: this.drawingPolylineSymbol
        });
        this._graphicsLayer.add(this._tempGraphic);

    }

    private _drawFreehandPolyline(evt) {

        let mp = this._toMapPoint(evt.x, evt.y);
        if (!mp) {
            //couldn't get a map point, so exit
            return;
        }

        let poly = <Polyline>this._tempGraphic.geometry;
        let lastPathIndex = poly.paths[0].length - 1;

        if (mp.x === poly.paths[0][lastPathIndex][0] && mp.y === poly.paths[0][lastPathIndex][1]) {
            return; //this point is the same as the last one in the path, so no need to add anything to it.
        }

        //add the map point to the first path of the geometry
        poly.paths[0].push([mp.x, mp.y]);

        //have to remove and re-add the graphic for it to show up. This sucks a bit.
        this._graphicsLayer.remove(this._tempGraphic);

        this._tempGraphic = new Graphic({
            geometry: poly,
            symbol: this.drawingPolylineSymbol
        });
        this._graphicsLayer.add(this._tempGraphic);

    }

    private _drawFreehandPolygon(evt) {
        let mp = this._toMapPoint(evt.x, evt.y);
        if (!mp) {
            //couldn't get a map point, so exit
            return;
        }

        let poly = <Polygon>this._tempGraphic.geometry;
        let lastRingIndex = poly.rings[0].length - 1;

        if (mp.x === poly.rings[0][lastRingIndex][0] && mp.y === poly.rings[0][lastRingIndex][1]) {
            return; //this point is the same as the last one in the path, so no need to add anything to it.
        }

        //add the map point to the first path of the geometry
        poly.rings[0].push([mp.x, mp.y]);

        //have to remove and re-add the graphic for it to show up. This sucks a bit.
        this._graphicsLayer.remove(this._tempGraphic);

        this._tempGraphic = new Graphic({
            geometry: poly,
            symbol: this.drawingPolygonSymbol
        });
        this._graphicsLayer.add(this._tempGraphic);

    }

    private _drawPolygon(evt) {
        let mp = this._toMapPoint(evt.x, evt.y);
        if (!mp) {
            //couldn't get a map point, so exit
            return;
        }

        let poly = <Polygon>this._tempGraphic.geometry;
        let lastRingIndex = poly.rings[0].length - 1;

        if (poly.rings[0].length === 1) {
            //add the map point to the first path of the geometry as there's only one point in there right now
            poly.rings[0].push([mp.x, mp.y]);
        }
        else {
            //replace the last point in the path with this point
            poly.rings[0][lastRingIndex] = [mp.x, mp.y];
        }

        //have to remove and re-add the graphic for it to show up. This sucks a bit.
        this._graphicsLayer.remove(this._tempGraphic);

        this._tempGraphic = new Graphic({
            geometry: poly,
            symbol: this.drawingPolygonSymbol
        });
        this._graphicsLayer.add(this._tempGraphic);

    }

    private _drawRectangle(evt) {
        let mp = this._toMapPoint(evt.x, evt.y);
        if (!mp) {
            //couldn't get a map point, so exit           
            return;
        }

        //replace or add the point at index 1
        if (this._rectMultipoint.points.length > 1) {
            this._rectMultipoint.removePoint(1);
        }
        this._rectMultipoint.addPoint(mp);

        let poly = <Polygon>this._tempGraphic.geometry;
        let ring = poly.rings[0];

        //use the extent of the multipoint to easily get the map points for the rectangle...
        //but use a polygon to contain the points and actually draw it, this works when drawing over the international date line.
        let e = this._rectMultipoint.extent;
        ring = [];
        ring.push([e.xmin, e.ymax]);
        ring.push([e.xmin, e.ymin]);
        ring.push([e.xmax, e.ymin]);
        ring.push([e.xmax, e.ymax]);
        ring.push([e.xmin, e.ymax]);

        poly.rings[0] = ring;

        //have to remove and re-add the graphic for it to show up. This sucks a bit.
        this._graphicsLayer.remove(this._tempGraphic);
        this._tempGraphic = new Graphic({
            geometry: poly,
            symbol: this.drawingPolygonSymbol
        });
        this._graphicsLayer.add(this._tempGraphic);

    }

    private _drawCircle(evt) {
        let mp = this._toMapPoint(evt.x, evt.y);
        if (!mp) {
            //couldn't get a map point, so exit           
            return;
        }

        let circle = <Circle>this._tempGraphic.geometry;
        let cp = <Point>circle.center;

        //get the distance between the center point and current point in meters and set the radius of the circle. Just doing planar calcs...could add a separate geodesic circle though.
        let dist = geometryEngine.distance(<Point>circle.center, mp, "meters");

        let newCircle = new Circle({
            center: cp,
            radius: dist,
            radiusUnit: "meters"
        });

        //have to remove and re-add the graphic for it to show up. This sucks a bit.
        this._graphicsLayer.remove(this._tempGraphic);
        this._tempGraphic = new Graphic({
            geometry: newCircle,
            symbol: this.drawingPolygonSymbol
        });
        this._graphicsLayer.add(this._tempGraphic);

    }



    private _prepareDraw(removeEvents?: string[]) {
        if (this._tempGraphic) {
            this._graphicsLayer.remove(this._tempGraphic);
            this._tempGraphic = null;
        }

        this._tooltip.hide();
        if (this.displayTooltips) {
            this._tooltip.attachToView(this.view);
        }


        this._drawStarted = false;
        this.isDrawing = true;

        //Make the drawTools graphics layer the highest in the layer order.
        this.view.map.reorder(this._graphicsLayer, this.view.map.allLayers.length - 1);

        //Reset the added handles array
        this._addedHandles = [];

        this._removedHandlers = [];

        //Disable map navigation if we want to remove some while drawing. There must be a better way of doing this though.
        //clear the view handlers from input manager - different child property depending on view type.    
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

            //loop the remove events and get rid of any that are contained in the removeEvents array
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

        //remove any custom handles that have been added
        for (let h of this._addedHandles) {
            h.remove();
        }

        //Reset the handles array
        this._addedHandles = [];

        //re-add the removed view handlers into the input manager to reenable navigation
        if (this._removedHandlers.length > 0) {
            let im = this.view["inputManager"];
            let handlers = this.view.type === "3d" ? im.viewEvents.inputManager._handlers : im._handlers;
            for (let rh of this._removedHandlers) {
                rh.removed = false;
                handlers.push(rh);
            }
        }


        //finalise the graphic if one has been passed in
        if (!graphic) {
            this.emit("draw-complete", undefined);
            return; //no graphic just return
        }

        //simplify the geometry
        let simpleGeometry = geometryEngine.simplify(graphic.geometry);

        //create a new graphic and remove the temp drawing one.
        let completedGraphic = new Graphic({
            geometry: simpleGeometry,
            symbol: graphic.geometry.type === "polyline" ? this.completePolylineSymbol : this.completePolygonSymbol
        });

        this._graphicsLayer.remove(graphic);
        this._graphicsLayer.add(completedGraphic);

        this.emit("draw-complete", completedGraphic);
    }

    private _toMapPoint(x: number, y: number): Point {
        return this.view.toMap(new ScreenPoint({ x: x, y: y }));
    }

    private _handleError(err) {
        this._drawComplete();
        console.error(err);
    }

}

class DrawToolsTooltip {

    public static DRAG_TEXT: string = "Press down to start and let go to complete.";
    public static CLICK_DRAW_PRECLICK_TEXT: string = "Click to start drawing.";
    public static CLICK_DRAW_FIRSTCLICK_TEXT: string = "Click to continue drawing.";
    public static CLICK_DRAW_FINAL_TEXT: string = "Double click to complete.";

    element: HTMLElement;
    view: MapView | SceneView;

    constructor() {

        //set up the element
        this.element = document.createElement("div");
        this.element.classList.add("draw-tools-tooltip"); //add a class so custom styles can be applied in css if desired

        //add some default styles
        let style = this.element.style;
        style.backgroundColor = "#FFF";
        style.position = "absolute";
        style.padding = "3px 5px";
        style.zIndex = "2000";
        style.border = "1px Solid #000";
        style.maxWidth = "170px";
        style.display = "none";
        style.msUserSelect = "none";
        style.webkitUserSelect = "none";

    }

    attachToView(view: MapView | SceneView) {
        this.view = view;
        //attach to the passed in view's container
        let container: any = view.container;
        container.appendChild(this.element);
        return this;
    }

    hide() {
        this.element.style.display = "none";
        return this;
    }

    position(left: number, top: number) {
        left += 20;
        this.element.style.display = "block";
        this.element.style.left = left + "px";
        this.element.style.top = top + "px";
        return this;
    }

    text(text: string) {
        this.element.innerHTML = text;
        return this;
    }

}