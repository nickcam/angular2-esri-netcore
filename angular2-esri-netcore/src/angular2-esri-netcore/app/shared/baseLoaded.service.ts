import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class BaseLoadedService {

    protected _loaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
    get loaded$() {
        return this._loaded.asObservable();
    }

}