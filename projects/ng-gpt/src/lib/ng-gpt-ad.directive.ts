import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { GptConfig, GPT_CONFIG } from './gpt.config';
import { Googletag, SafeFrameConfig, Slot } from './ng-gpt-googletag.interface';
import { NgGptService } from './ng-gpt.service';
import { GptRefreshService } from './services';
import { GptIDGeneratorService } from './services/gpt-idGenerator.service';

declare var googletag: Googletag;

export class GptRefreshEvent {
  type: string;
  slot: any;
  data?: any;
}

interface SizeMapping {
  viewport: [number, number];
  sizes: [number, number][];
}

interface TargetingArguments {
  [key: string]: any;
}

@Directive({ selector: 'gpt-ad' })
export class NgGptAdDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input() id: string;
  @Input() adUnit: string;
  @Input() sizes: [number, number][] | string = 'fluid';
  @Input() sizeMapping: SizeMapping[] = [];
  @Input() forceSafeFrame: boolean;
  @Input() safeFrameConfig: SafeFrameConfig;
  @Input() refresh: number;
  @Input() collapseEmptyDivs: boolean;
  @Input() targetingArguments: TargetingArguments = {};

  @Output() afterRefresh: EventEmitter<GptRefreshEvent> = new EventEmitter();

  private slot: Slot;
  private onSameNavigation: Subscription;
  private scripts: any[] = [];
  private exclusions: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformID: Object,
    private elementRef: ElementRef,
    private gpt: NgGptService,
    private gptRefresh: GptRefreshService,
    private gptIDGenerator: GptIDGeneratorService,
    @Inject(GPT_CONFIG) private config: GptConfig,
    @Optional() router: Router
  ) {
    if (isPlatformBrowser(this.platformID)) {
      this.gptRefresh.refreshEvent.subscribe((slot) => {
        if (slot === this.slot) {
          this.afterRefresh.emit({ type: 'refresh', slot: slot });
        }
      });
      if (router) {
        this.onSameNavigation = router.events.pipe().subscribe((event: any) => {
          console.log({ event });

          if (
            this.slot &&
            !this.refresh &&
            this.config.onSameNavigation === 'refresh'
          ) {
            this.refreshContent.call(this);
          }
        });
      }
    }
  }

  ngOnInit() {
    this.checkRequiredFields(this.adUnit, 'adUnit');
    if (isPlatformBrowser(this.platformID) && !this.id) {
      this.gptIDGenerator.gptIDGenerator(this.elementRef.nativeElement);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformID)) {
      this.gpt.defineTask(() => {
        this.defineSlot();
      });
    }
  }

  ngOnDestroy() {
    if (this.slot) {
      googletag.destroySlots([this.slot]);
    }
    if (this.onSameNavigation) {
      this.onSameNavigation.unsubscribe();
    }
  }

  private setSizeMapping(slot: Slot) {
    const ad = this.getState();

    if (ad.sizeMapping.length === 0) {
      return;
    }

    const sizeMapping = googletag.sizeMapping();

    ad.sizeMapping.forEach((mapping) => {
      sizeMapping.addSize(mapping.viewport, mapping.sizes);
    });

    slot.defineSizeMapping(sizeMapping.build());
  }

  private defineSlot() {
    const ad = this.getState(),
      element = this.elementRef.nativeElement;

    this.slot = googletag.defineSlot(ad.adUnit, ad.sizes, element.id);

    if (
      this.forceSafeFrame !== undefined &&
      ad.forceSafeFrame === !this.config.forceSafeFrame
    ) {
      this.slot.setForceSafeFrame(ad.forceSafeFrame);
    }

    // if (ad.clickUrl) {
    //   this.slot.setClickUrl(ad.clickUrl);
    // }

    if (ad.collapseEmptyDivs) {
      this.slot.setCollapseEmptyDiv(true, true);
    }

    if (ad.safeFrameConfig) {
      this.slot.setSafeFrameConfig(ad.safeFrameConfig);
    }

    googletag.pubads().addEventListener('slotRenderEnded', (event) => {
      if (event.slot === this.slot) {
        this.afterRefresh.emit({
          type: 'renderEnded',
          slot: this.slot,
          data: event,
        });
      }
    });

    this.setSizeMapping(this.slot);

    Object.keys(ad.targetingArguments).forEach((arg) => {
      this.slot.setTargeting(arg, ad.targetingArguments[arg]);
    });

    ad.exclusions.forEach((exclusion) => {
      this.slot.setCategoryExclusion(exclusion);
    });

    ad.scripts.forEach((script) => {
      script(this.slot);
    });

    if (this.config.enableVideoAds) {
      this.slot.addService(googletag.companionAds());
    }

    this.slot.addService(googletag.pubads());

    this.refreshContent();
  }

  private refreshContent() {
    this.gptRefresh.slotRefresh(this.slot, this.refresh, true).then((slot) => {
      this.afterRefresh.emit({ type: 'init', slot: slot });
    });
  }

  get isHidden() {
    return this.gptRefresh.hiddenCheck(this.elementRef.nativeElement);
  }

  getState() {
    return Object.freeze({
      sizes: typeof this.sizes === 'string' ? [this.sizes] : this.sizes,
      sizeMapping: this.sizeMapping,
      targetingArguments: this.targetingArguments,
      exclusions: this.exclusions,
      adUnit: this.adUnit,
      forceSafeFrame: this.forceSafeFrame === true,
      safeFrameConfig: this.safeFrameConfig,
      // clickUrl: this.clickUrl,
      refresh: this.refresh,
      scripts: this.scripts,
      collapseEmptyDivs: this.collapseEmptyDivs === true,
    });
  }

  checkRequiredFields(input: any, name: string) {
    if (input === null) {
      throw new Error(`Attribute ${name} is required`);
    }
  }

  addExclusion(exclusion: any) {
    this.exclusions.push(exclusion);
  }

  addScript(script: any) {
    this.scripts.push(script);
  }
}
