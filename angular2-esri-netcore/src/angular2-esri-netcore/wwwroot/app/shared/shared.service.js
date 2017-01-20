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
var SharedService = (function () {
    function SharedService() {
    }
    SharedService.prototype.getDate = function () {
        return new Date();
    };
    SharedService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], SharedService);
    return SharedService;
}());
exports.SharedService = SharedService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9hcHAvc2hhcmVkL3NoYXJlZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQkFBMkIsZUFBZSxDQUFDLENBQUE7QUFHM0M7SUFBQTtJQU1BLENBQUM7SUFKRywrQkFBTyxHQUFQO1FBQ0ksTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUxMO1FBQUMsaUJBQVUsRUFBRTs7cUJBQUE7SUFPYixvQkFBQztBQUFELENBQUMsQUFORCxJQU1DO0FBTlkscUJBQWEsZ0JBTXpCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBTaGFyZWRTZXJ2aWNlIHtcclxuXHJcbiAgICBnZXREYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpO1xyXG4gICAgfVxyXG5cclxufSAiXX0=