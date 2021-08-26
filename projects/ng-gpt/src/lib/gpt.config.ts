import { InjectionToken } from '@angular/core';
import {
  LazyLoadOptionsConfig,
  SafeFrameConfig,
} from './ng-gpt-googletag.interface';

export class GptConfig {
  [index: string]: any;
  idleLoad?: boolean;
  onSameNavigation?: 'refresh' | 'ignore';
  singleRequestMode?: boolean;
  enableVideoAds?: boolean;
  personalizedAds?: boolean;
  collapseEmptyDivs?: boolean;
  centering?: boolean;
  address?: string;
  limitedAds?: boolean;
  forceSafeFrame?: boolean;
  ppid?: string;
  globalTargeting?: object;
  safeFrameConfig?: SafeFrameConfig;
  enableLazyLoad?: LazyLoadOptionsConfig;
  loadGPT?: boolean;
}

export const GPT_CONFIG = new InjectionToken<GptConfig>('gptConfig');
