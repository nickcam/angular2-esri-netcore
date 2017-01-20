"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var shared_service_1 = require('./shared.service');
//A Shared service - not really used in this example except to re-export some angular modules and to expose the dummy shared.service that doesn't really do anything.
var SharedModule = (function () {
    function SharedModule() {
    }
    SharedModule.forRoot = function () {
        return {
            ngModule: SharedModule,
            providers: [shared_service_1.SharedService]
        };
    };
    SharedModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                http_1.HttpModule
            ],
            declarations: [],
            exports: [
                //re-export some angular modules so other modules (ie: all of them) that reference shared module don't need to explicitly import them.
                common_1.CommonModule,
                forms_1.FormsModule,
                http_1.HttpModule,
            ],
            providers: [
                shared_service_1.SharedService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9zaGFyZWQvc2hhcmVkLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EscUJBQThDLGVBQWUsQ0FBQyxDQUFBO0FBQzlELHVCQUE2QixpQkFBaUIsQ0FBQyxDQUFBO0FBQy9DLHNCQUE0QixnQkFBZ0IsQ0FBQyxDQUFBO0FBQzdDLHFCQUEyQixlQUFlLENBQUMsQ0FBQTtBQUUzQywrQkFBOEIsa0JBQWtCLENBQUMsQ0FBQTtBQUVqRCxxS0FBcUs7QUFxQnJLO0lBQUE7SUFPQSxDQUFDO0lBTlUsb0JBQU8sR0FBZDtRQUNJLE1BQU0sQ0FBQztZQUNILFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFNBQVMsRUFBRSxDQUFDLDhCQUFhLENBQUM7U0FDN0IsQ0FBQztJQUNOLENBQUM7SUF6Qkw7UUFBQyxlQUFRLENBQUM7WUFDTixPQUFPLEVBQUU7Z0JBQ0wscUJBQVk7Z0JBQ1osbUJBQVc7Z0JBQ1gsaUJBQVU7YUFDYjtZQUNELFlBQVksRUFBRSxFQUNiO1lBQ0QsT0FBTyxFQUFFO2dCQUVMLHNJQUFzSTtnQkFDdEkscUJBQVk7Z0JBQ1osbUJBQVc7Z0JBQ1gsaUJBQVU7YUFDYjtZQUNELFNBQVMsRUFBRTtnQkFDUCw4QkFBYTthQUNoQjtTQUNKLENBQUM7O29CQUFBO0lBUUYsbUJBQUM7QUFBRCxDQUFDLEFBUEQsSUFPQztBQVBZLG9CQUFZLGVBT3hCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IEh0dHBNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9odHRwJztcclxuXHJcbmltcG9ydCB7IFNoYXJlZFNlcnZpY2UgfSBmcm9tICcuL3NoYXJlZC5zZXJ2aWNlJztcclxuXHJcbi8vQSBTaGFyZWQgc2VydmljZSAtIG5vdCByZWFsbHkgdXNlZCBpbiB0aGlzIGV4YW1wbGUgZXhjZXB0IHRvIHJlLWV4cG9ydCBzb21lIGFuZ3VsYXIgbW9kdWxlcyBhbmQgdG8gZXhwb3NlIHRoZSBkdW1teSBzaGFyZWQuc2VydmljZSB0aGF0IGRvZXNuJ3QgcmVhbGx5IGRvIGFueXRoaW5nLlxyXG5cclxuQE5nTW9kdWxlKHtcclxuICAgIGltcG9ydHM6IFtcclxuICAgICAgICBDb21tb25Nb2R1bGUsXHJcbiAgICAgICAgRm9ybXNNb2R1bGUsXHJcbiAgICAgICAgSHR0cE1vZHVsZVxyXG4gICAgXSxcclxuICAgIGRlY2xhcmF0aW9uczogW1xyXG4gICAgXSxcclxuICAgIGV4cG9ydHM6IFtcclxuXHJcbiAgICAgICAgLy9yZS1leHBvcnQgc29tZSBhbmd1bGFyIG1vZHVsZXMgc28gb3RoZXIgbW9kdWxlcyAoaWU6IGFsbCBvZiB0aGVtKSB0aGF0IHJlZmVyZW5jZSBzaGFyZWQgbW9kdWxlIGRvbid0IG5lZWQgdG8gZXhwbGljaXRseSBpbXBvcnQgdGhlbS5cclxuICAgICAgICBDb21tb25Nb2R1bGUsXHJcbiAgICAgICAgRm9ybXNNb2R1bGUsXHJcbiAgICAgICAgSHR0cE1vZHVsZSxcclxuICAgIF0sXHJcbiAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICBTaGFyZWRTZXJ2aWNlXHJcbiAgICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTaGFyZWRNb2R1bGUge1xyXG4gICAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmdNb2R1bGU6IFNoYXJlZE1vZHVsZSxcclxuICAgICAgICAgICAgcHJvdmlkZXJzOiBbU2hhcmVkU2VydmljZV1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59Il19