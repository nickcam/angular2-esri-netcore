
import { EventEmitter } from '@angular/core';


/**
 * A class that contains some common functions/properties for menu handling.
   Note: Any componetn that inherits from this class will need to add the following to it's component annotation:

    inputs: ["isOpen"],
    outputs: ["onClosed", "onOpenMainMenu"]

    This is because the @Input and @Output decorators don't get handled correctly when being used as inherited properties, so the sub-class component needs to explicity
    define these base properties as inputs and outputs in it's component annotation. This is as of RC 6. They may work as would be expecetd in future versions.

 */
export abstract class BaseMenuComponent {

    public _isOpen: boolean;

    public get isOpen(): boolean {
        return this._isOpen;
    }

    public set isOpen(val) {
        this._isOpen = val;
        this.isOpenUpdated(val);
    }

    onClosed = new EventEmitter<boolean>(true);

    constructor() {
    }

   
    close() {
        this.onClosed.emit(true);
        this.isOpen = false;
        this.onMenuClosed();
    }

    protected onMenuOpened() {
        //override this method in sub classes to perform operations when the menu is opened
    }

    protected onMenuClosed() {
        //override this method in sub classes to perform operations when the menu is closed
    }

    isOpenUpdated(val: boolean) {
        if (val) {
            this.onMenuOpened();
        }

    }
} 