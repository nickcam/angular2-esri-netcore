"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GraphicsLayer_1 = require('esri/layers/GraphicsLayer');
var decorators_1 = require("esri/core/accessorSupport/decorators");
function getBase() { return GraphicsLayer_1.default; }
var ExtendGraphicsLayer = decorators_1.default.declared(getBase());
/**
    Example class to demonstrate how to subclass esri classes that inherit from Accessor classes in v4.1. This pattern will likely change in future updates though.
    See this issue - https://github.com/Esri/jsapi-resources/issues/40 and this repo - https://github.com/ycabon/extend-accessor-example
*/
var CustomGraphicsLayer = (function (_super) {
    __extends(CustomGraphicsLayer, _super);
    function CustomGraphicsLayer(options) {
        _super.call(this, options);
    }
    CustomGraphicsLayer = __decorate([
        decorators_1.default.subclass("CustomGraphicsLayer"), 
        __metadata('design:paramtypes', [Object])
    ], CustomGraphicsLayer);
    return CustomGraphicsLayer;
}(ExtendGraphicsLayer));
exports.CustomGraphicsLayer = CustomGraphicsLayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tR3JhcGhpY3NMYXllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9tYXAvZXNyaWV4dGVuZC9jdXN0b21HcmFwaGljc0xheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUVBLDhCQUEwQiwyQkFBMkIsQ0FBQyxDQUFBO0FBQ3RELDJCQUFzQyxzQ0FBc0MsQ0FBQyxDQUFBO0FBSTdFLHFCQUFtRCxNQUFNLENBQU0sdUJBQWEsQ0FBQyxDQUFDLENBQUM7QUFFL0UsSUFBSSxtQkFBbUIsR0FBRyxvQkFBeUIsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUV4RTs7O0VBR0U7QUFFRjtJQUF5Qyx1Q0FBbUI7SUFFeEQsNkJBQVksT0FBd0M7UUFDaEQsa0JBQU0sT0FBTyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUxMO1FBQUMsb0JBQXlCLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDOzsyQkFBQTtJQU8xRCwwQkFBQztBQUFELENBQUMsQUFORCxDQUF5QyxtQkFBbUIsR0FNM0Q7QUFOWSwyQkFBbUIsc0JBTS9CLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuXHJcbmltcG9ydCBHcmFwaGljc0xheWVyIGZyb20gJ2VzcmkvbGF5ZXJzL0dyYXBoaWNzTGF5ZXInO1xyXG5pbXBvcnQgYWNjZXNzb3JTdXBwb3J0RGVjb3JhdG9ycyBmcm9tIFwiZXNyaS9jb3JlL2FjY2Vzc29yU3VwcG9ydC9kZWNvcmF0b3JzXCI7XHJcblxyXG5pbnRlcmZhY2UgQmFzZUdyYXBoaWNzTGF5ZXIgZXh0ZW5kcyBHcmFwaGljc0xheWVyIHt9XHJcbmludGVyZmFjZSBCYXNlR3JhcGhpY3NMYXllckNvbnN0cnVjdG9yIHsgbmV3IChvcHRpb25zPzogX19lc3JpLkdyYXBoaWNzTGF5ZXJQcm9wZXJ0aWVzKTogQmFzZUdyYXBoaWNzTGF5ZXI7IH1cclxuZnVuY3Rpb24gZ2V0QmFzZSgpOiBCYXNlR3JhcGhpY3NMYXllckNvbnN0cnVjdG9yIHsgcmV0dXJuIDxhbnk+R3JhcGhpY3NMYXllcjsgfVxyXG5cclxubGV0IEV4dGVuZEdyYXBoaWNzTGF5ZXIgPSBhY2Nlc3NvclN1cHBvcnREZWNvcmF0b3JzLmRlY2xhcmVkKGdldEJhc2UoKSk7XHJcblxyXG4vKipcclxuICAgIEV4YW1wbGUgY2xhc3MgdG8gZGVtb25zdHJhdGUgaG93IHRvIHN1YmNsYXNzIGVzcmkgY2xhc3NlcyB0aGF0IGluaGVyaXQgZnJvbSBBY2Nlc3NvciBjbGFzc2VzIGluIHY0LjEuIFRoaXMgcGF0dGVybiB3aWxsIGxpa2VseSBjaGFuZ2UgaW4gZnV0dXJlIHVwZGF0ZXMgdGhvdWdoLlxyXG4gICAgU2VlIHRoaXMgaXNzdWUgLSBodHRwczovL2dpdGh1Yi5jb20vRXNyaS9qc2FwaS1yZXNvdXJjZXMvaXNzdWVzLzQwIGFuZCB0aGlzIHJlcG8gLSBodHRwczovL2dpdGh1Yi5jb20veWNhYm9uL2V4dGVuZC1hY2Nlc3Nvci1leGFtcGxlXHJcbiovXHJcbkBhY2Nlc3NvclN1cHBvcnREZWNvcmF0b3JzLnN1YmNsYXNzKFwiQ3VzdG9tR3JhcGhpY3NMYXllclwiKVxyXG5leHBvcnQgY2xhc3MgQ3VzdG9tR3JhcGhpY3NMYXllciBleHRlbmRzIEV4dGVuZEdyYXBoaWNzTGF5ZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBfX2VzcmkuR3JhcGhpY3NMYXllclByb3BlcnRpZXMpIHtcclxuICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbn1cclxuIl19