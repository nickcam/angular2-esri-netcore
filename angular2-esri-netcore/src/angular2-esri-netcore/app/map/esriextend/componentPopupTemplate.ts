import { Injectable, ReflectiveInjector, ComponentFactoryResolver, Injector } from '@angular/core';

import PopupTemplate from 'esri/PopupTemplate';
import asd from "esri/core/accessorSupport/decorators";


interface ComponentPopupTemplateProperties extends __esri.PopupTemplateProperties {
    resolver: ComponentFactoryResolver;
    injector: Injector;
    componentType: any;
}


/**
 *   Inherits from PopupTemplate and facilitates laoding an angular component for the content of the template.
 *   Requires a ComponentFactoryResolver and Injector to be added to the options as these are needed to perform the dynamic creation of the component. Should probalby be instantiated from an
 *   Angular service for this reason.
 *   Also requires the componentType to dynamically create as part of the options. Will pass the feature for the popup as an injected property to whatever component should be displayed in the content.
 */
@asd.subclass("ComponentPopupTemplate")
export class ComponentPopupTemplate extends asd.declared(PopupTemplate) {

    componentType: any;

    private _resolver: ComponentFactoryResolver;
    private _injector: Injector;

    //override content property to be of type any so it can set to something other than string within this class
    content: any;


    constructor(options: ComponentPopupTemplateProperties) {
        super(options);

        if (!options.componentType || !options.injector || !options.resolver) {
            console.error("ComponentPopupTemplate: componentType, resolver and injector must be set in options.");
            return;
        }

        this.componentType = options.componentType;
        this._resolver = options.resolver;
        this._injector = options.injector;

        //set the content 
        this.content = (feature) => {
            return this._getContent(feature);
        }

    }

    private _getContent(feature: any) {
         
        try {

            // Dynamically create an instance of the componentType passed that was passed into the constructor and pass the selected features graphic to it.
            let inputData = { feature: feature };
            let inputProviders: any = Object.keys(inputData).map((inputName) => { return { provide: inputName, useValue: inputData[inputName] }; });

            //create the resolved injectoed references using our custom inputs and this services injector
            let resolvedProviders = ReflectiveInjector.resolveAndCreate(inputProviders, this._injector);

            //create a component factory of the type TabbedPopupComponent
            let componentFactory = this._resolver.resolveComponentFactory(this.componentType);

            //create the component
            let component = componentFactory.create(resolvedProviders);

            //run a change detection on the component so that the template is updated with the injected values that are set in the ctor of the component
            component.changeDetectorRef.detectChanges();

            //return the html element
            return component.location.nativeElement;
        }
        catch (err) {
            console.error("ComponentPopupTemplate: Error dynamically creating component for popup content. Is the componentType set in EntryComponents in module definition. %O", err);
        }
    }


}