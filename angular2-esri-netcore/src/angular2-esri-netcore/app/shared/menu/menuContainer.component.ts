
import { Component, Input, Output, EventEmitter, } from '@angular/core';


@Component({
    moduleId: module.id,
    selector: 'menu-container',
    templateUrl: 'menuContainer.component.html'
})
export class MenuContainerComponent {

    @Input()
    menuSizeClassName: string;

    @Input()
    heading: string;

    @Input()
    headingIconClassName: string;

    @Input()
    rootClassNames: string;

    @Input()
    contentClassNames: string;

    @Input()
    isOpen: boolean;

    @Input()
    displaySizingButtons: boolean;

    @Output()
    onClosed = new EventEmitter<boolean>();

    @Output()
    onMaximisedChanged = new EventEmitter<boolean>();

    isMaximised: boolean;

    constructor() {
    }

    ngOnInit() {
    }

    
    close() {
        this.isMaximised = false;
        this.onClosed.emit(true);
        this.onMaximisedChanged.emit(this.isMaximised);
    }

    toggleMaximise() {
        this.isMaximised = !this.isMaximised;
        this.onMaximisedChanged.emit(this.isMaximised);
    }

} 