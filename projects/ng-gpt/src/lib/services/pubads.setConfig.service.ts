import { Injectable } from '@angular/core';
import { PubAdsService, SafeFrameConfig } from '../ng-gpt-googletag.interface';

@Injectable()
export class PubadsSetConfigService {
  /**
   * Passes location information from websites so you can geo-target line items to specific locations.
   *
   * @param address Freeform address.
   * @param pubads Publisher Ads service. This service is used to fetch and show ads from your Google Ad Manager account.
   */
  public addLocation(address: string, pubads: PubAdsService): void {
    if (address) {
      pubads.setLocation(address);
    }
  }

  /**
   * Sets the value for the publisher-provided ID.
   *
   * @param ppid An alphanumeric ID provided by the publisher with a recommended maximum of 150 characters.
   * @param pubads Publisher Ads service. This service is used to fetch and show ads from your Google Ad Manager account.
   */
  public addPPID(ppid: string, pubads: PubAdsService): void {
    if (ppid) {
      pubads.setPublisherProvidedId(ppid);
    }
  }

  /**
   * Sets a custom targeting parameter for this slot.
   *
   * @param globalTargeting
   * @param pubads Publisher Ads service. This service is used to fetch and show ads from your Google Ad Manager account.
   */
  public addTargeting(
    globalTargeting: { [index: string]: any },
    pubads: PubAdsService
  ): void {
    if (Object.keys(globalTargeting).length) {
      for (const key in globalTargeting) {
        if (globalTargeting.hasOwnProperty(key)) {
          pubads.setTargeting(key, globalTargeting[key]);
        }
      }
    }
  }

  /**
   * Sets the page-level preferences for SafeFrame configuration.
   *
   * @param safeFrameConfig The configuration object.
   * @param pubads Publisher Ads service. This service is used to fetch and show ads from your Google Ad Manager account.
   */
  public addSafeFrameConfig(
    safeFrameConfig: SafeFrameConfig,
    pubads: PubAdsService
  ): void {
    if (Object.keys(safeFrameConfig).length)
      pubads.setSafeFrameConfig(safeFrameConfig);
  }
}
