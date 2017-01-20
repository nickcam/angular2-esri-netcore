

import GraphicsLayer from 'esri/layers/GraphicsLayer';
import accessorSupportDecorators from "esri/core/accessorSupport/decorators";

interface BaseGraphicsLayer extends GraphicsLayer {}
interface BaseGraphicsLayerConstructor { new (options?: __esri.GraphicsLayerProperties): BaseGraphicsLayer; }
function getBase(): BaseGraphicsLayerConstructor { return <any>GraphicsLayer; }

let ExtendGraphicsLayer = accessorSupportDecorators.declared(getBase());

/**
    Example class to demonstrate how to subclass esri classes that inherit from Accessor classes in v4.1. This pattern will likely change in future updates though.
    See this issue - https://github.com/Esri/jsapi-resources/issues/40 and this repo - https://github.com/ycabon/extend-accessor-example
*/
@accessorSupportDecorators.subclass("CustomGraphicsLayer")
export class CustomGraphicsLayer extends ExtendGraphicsLayer {

    constructor(options?: __esri.GraphicsLayerProperties) {
        super(options);
    }

}
