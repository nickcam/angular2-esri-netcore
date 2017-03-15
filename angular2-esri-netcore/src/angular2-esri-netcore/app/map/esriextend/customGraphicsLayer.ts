
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import asd from "esri/core/accessorSupport/decorators";

/**
    Example class to demonstrate how to subclass esri classes that inherit from Accessor classes.
*/
@asd.subclass("CustomGraphicsLayer")
export class CustomGraphicsLayer extends asd.declared(GraphicsLayer) {

    @asd.property() 
    someProperty: string;

    constructor(options?: __esri.GraphicsLayerProperties) {
        super(options);
    } 

}
