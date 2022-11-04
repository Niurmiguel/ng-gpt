import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { PubadsSetConfigService, ScriptInjectorService } from './services';
import { GptConfig, GPT_CONFIG } from './gpt.config';
import { GPT_URL } from './gpt.contants';
import {
  Googletag,
  LazyLoadOptionsConfig,
  SafeFrameConfig,
} from './ng-gpt-googletag.interface';
import { IdleService } from './services/idle.service';

@Injectable({
  providedIn: 'root',
})
export class NgGptService {
  private collapseEmptyDivs = true;
  private enableVideoAds = false;
  private enableLazyLoad: LazyLoadOptionsConfig = {};
  private centering = false;
  private personalizedAds = true;
  private limitedAds = false;
  private forceSafeFrame = false;
  private address: string = '';
  private ppid: string = '';
  private globalTargeting: object = {};
  private safeFrameConfig: SafeFrameConfig = {};
  private loadGPT = true;
  private loaded = false;
  [index: string]: any;

  constructor(
    @Inject(PLATFORM_ID) private platformID: Object,
    @Inject(GPT_CONFIG) private config: GptConfig,
    @Optional() idleLoad: IdleService,
    private pubadsSetConfig: PubadsSetConfigService,
    private scriptInjector: ScriptInjectorService
  ) {
    if (isPlatformBrowser(this.platformID)) {
      const w: any = window,
        googletag: Googletag = w.googletag || {};

      this.gptConfig();

      googletag.cmd = googletag.cmd || [];
      googletag.cmd.push(() => {
        this.setup();
      });
      w.googletag = googletag;

      if (this.loadGPT) {
        const loadScript = () => {
          this.scriptInjector.scriptInjector(GPT_URL).then((script: any) => {
            this.loaded = true;
          });
        };
        if (idleLoad) {
          idleLoad.request(loadScript);
        } else {
          loadScript();
        }
      }
    }
  }

  private gptConfig() {
    for (const key in this.config) {
      if (this.hasOwnProperty(key)) {
        this[key] = this.config[key];
      }
    }
  }

  private setup() {
    const w: any = window,
      googletag: Googletag = w.googletag,
      pubads = googletag.pubads();

    if (this.enableVideoAds) pubads.enableVideoAds();
    if (this.collapseEmptyDivs) pubads.collapseEmptyDivs();

    pubads.disableInitialLoad();
    pubads.setForceSafeFrame(this.forceSafeFrame);
    pubads.setCentering(this.centering);

    this.pubadsSetConfig.addLocation(this.address, pubads);
    this.pubadsSetConfig.addPPID(this.ppid, pubads);
    this.pubadsSetConfig.addTargeting(this.globalTargeting, pubads);
    this.pubadsSetConfig.addSafeFrameConfig(this.safeFrameConfig, pubads);

    pubads.setPrivacySettings({
      limitedAds: this.limitedAds,
      nonPersonalizedAds: !this.personalizedAds,
    });

    if (this.config.singleRequestMode !== true) {
      if (this.config.enableVideoAds) {
        pubads.enableVideoAds();
      }
      googletag.enableServices();
    }

    if (Object.keys(this.enableLazyLoad).length) {
      pubads.enableLazyLoad(this.enableLazyLoad);
    }
  }

  hasLoaded(): boolean {
    return this.loaded;
  }

  defineTask(task: any): void {
    if (isPlatformBrowser(this.platformID)) {
      const w: any = window,
        googletag: Googletag = w.googletag;

      googletag.cmd.push(task);
    }
  }
}
