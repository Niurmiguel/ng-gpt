import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';

@Injectable()
export class IdleService {
  private requestIdleCallback: any;

  constructor(@Inject(PLATFORM_ID) platformId: Object, zone: NgZone) {
    const w: any = isPlatformBrowser(platformId) ? window : {};
    if (w.requestIdleCallback) {
      this.requestIdleCallback = (fun: Function) => {
        return w.requestIdleCallback(fun);
      };
    } else {
      this.requestIdleCallback = (fun: Function) => {
        return zone.runOutsideAngular(() => w.setTimeout(fun, 50));
      };
    }
  }

  request(fun: Function) {
    this.requestIdleCallback(fun);
  }
}
