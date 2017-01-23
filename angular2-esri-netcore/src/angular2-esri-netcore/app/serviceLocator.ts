
import { Injector } from '@angular/core';

/**
 * A helper class to get refernces to services not through DI which is sometimes useful. The injector variable is set in the AppModule constructor.
 */
export class ServiceLocator {
    public static injector: Injector;

    public static get<T>(Service): T {
        return <T>this.injector.get(Service);
    }

}