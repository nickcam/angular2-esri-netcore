import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {

    getDate() {
        return new Date();
    }

} 