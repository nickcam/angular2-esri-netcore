/**
 * Custom typings to allow subclassing of Accessor classes
 */
declare module "esri/core/accessorSupport/decorators" {
    export function cast(proto: Object, methodName: string, descriptor: PropertyDescriptor): any;
    export function cast(ctor: Function): any;
    export function cast(propertyName: string): any;
    export function declared<T>(base: T, ...rest: any[]): T;
    export function property<T>(metadata?: PropertyMetadata<T>): any;
    export function subclass(declaredClass?: string): any;
}


interface PropertyMetadata<T> {
    get?: () => T;
    set?: (value: T) => void;
    cast?: (value: any) => T;
    dependsOn?: string[];
    value?: T;
    type?: (new (...params: any[]) => T) | [new (...params: any[]) => T];
    readOnly?: boolean;
    aliasOf?: string;
}

