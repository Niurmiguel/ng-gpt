import {
  Injectable,
  EventEmitter,
  Optional,
  Injector,
  Inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Subscription, timer, from } from 'rxjs';

import { GptConfig, GPT_CONFIG } from '../gpt.config';
import { ParseDurationService } from '.';
import { Googletag } from '../ng-gpt-googletag.interface';

class GPTRefreshError extends Error {}

declare var googletag: Googletag;

@Injectable()
export class GptRefreshService {
  refreshEvent: EventEmitter<any> = new EventEmitter();
  private refreshSlots: any[] = [];
  private singleRequest: Subscription;
  private intervals: { [index: string]: any } = {};

  constructor(
    @Optional()
    @Inject(GPT_CONFIG)
    private config: GptConfig,
    private inject: Injector,
    private parseDuration: ParseDurationService
  ) {}

  slotRefresh(
    slot: any,
    refreshInterval?: number | string,
    initRefresh = false
  ) {
    const deferred: Promise<any> = from([slot]).toPromise(),
      task = { slot: slot, deferred: deferred };

    deferred.then(() => {
      if (this.hasSlotInterval(slot)) {
        this.cancelInterval(slot);
      }
      if (refreshInterval) {
        this.addSlotInterval(task, refreshInterval);
      }
    });

    if (this.config.singleRequestMode === true && initRefresh) {
      // Use a timer to handle refresh of a single request mode
      this.refreshSlots.push(slot);
      if (this.singleRequest && !this.singleRequest.closed) {
        this.singleRequest.unsubscribe();
      }
      this.singleRequest = timer(100).subscribe(() => {
        const pubads = googletag.pubads();
        pubads.enableSingleRequest();
        googletag.enableServices();
        this.refreshSlots.forEach((s: any) => {
          googletag.display(s.getSlotElementId());
        });
        pubads.refresh(this.refreshSlots);
        this.refreshSlots = [];
      });
    } else {
      googletag.display(slot.getSlotElementId());
      this.refresh([task]);
    }

    return deferred;
  }

  cancelInterval(slot: any) {
    if (!this.hasSlotInterval(slot)) {
      throw new GPTRefreshError('No interval for given slot');
    }

    const interval: Subscription = this.intervals[this.slotIntervalKey(slot)];
    interval.unsubscribe();
    delete this.intervals[slot];

    return this;
  }

  private hasSlotInterval(slot: any) {
    return this.slotIntervalKey(slot) in this.intervals;
  }

  private refresh(tasks?: any[]) {
    if (tasks === undefined) {
      googletag.cmd.push(() => {
        googletag.pubads().refresh();
      });
      return;
    }

    if (tasks.length === 0) {
      return false;
    }

    googletag.cmd.push(() => {
      googletag.pubads().refresh(tasks.map((task: any) => task.slot));
      tasks.forEach((task: any) => {
        Promise.resolve(task.slot);
      });
    });

    return true;
  }

  private addSlotInterval(task: any, interval: any) {
    const parsedInterval = this.parseDuration.parseDuration(interval);
    this.validateInterval(parsedInterval, interval);

    const refresh = timer(parsedInterval, parsedInterval).subscribe(() => {
      const doc = this.inject.get(DOCUMENT);
      if (!this.hiddenCheck(doc.getElementById(task.slot.getSlotElementId()))) {
        this.refresh([task]);
        this.refreshEvent.emit(task.slot);
      }
    });

    this.intervals[this.slotIntervalKey(task.slot)] = refresh;

    return refresh;
  }

  private slotIntervalKey(slot: any) {
    return slot.getSlotId().getDomId();
  }

  private validateInterval(milliseconds: number, beforeParsing: any) {
    if (milliseconds < 1000) {
      console.warn('Careful: ${beforeParsing} is quite a low interval!');
    }
  }

  hiddenCheck(element: any): any {
    if (typeof window !== 'undefined') {
      const css = window.getComputedStyle(element);
      if (css.display === 'none') {
        return true;
      } else if (element.parentElement) {
        return this.hiddenCheck(element.parentElement);
      }
    }
    return false;
  }
}
