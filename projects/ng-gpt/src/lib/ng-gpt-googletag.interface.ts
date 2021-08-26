import { GeneralSize, SingleSizeArray, SizeMappingArray } from './gpt.type';

interface ResponseInformation {
  advertiserId: string;
  campaignId: string;
  creativeId?: number | undefined;
  creativeTemplateId?: number | undefined;
  lineItemId?: number | undefined;
}

export interface SafeFrameConfig {
  allowOverlayExpansion?: boolean | undefined;
  allowPushExpansion?: boolean | undefined;
  sandbox?: boolean | undefined;
  useUniqueDomain?: boolean | null | undefined;
}

export interface LazyLoadOptionsConfig {
  fetchMarginPercent?: number | undefined;
  renderMarginPercent?: number | undefined;
  mobileScaling?: number | undefined;
}

interface PrivacySettingsConfig {
  childDirectedTreatment?: boolean | null | undefined;
  limitedAds?: boolean | null | undefined;
  restrictDataProcessing?: boolean | null | undefined;
  underAgeOfConsent?: boolean | null | undefined;
}

interface CommandArray {
  push(f: () => void): number;
}

export interface Service {
  addEventListener(
    eventType: 'slotRenderEnded',
    listener: (event: SlotRenderEndedEvent) => void
  ): Service;
  addEventListener(
    eventType: 'slotRequested',
    listener: (event: SlotRequestedEvent) => void
  ): Service;
  addEventListener(
    eventType: 'slotResponseReceived',
    listener: (event: SlotResponseReceived) => void
  ): Service;
  addEventListener(
    eventType: 'slotVisibilityChanged',
    listener: (event: SlotVisibilityChangedEvent) => void
  ): Service;
  addEventListener(
    eventType: string,
    listener: (event: Event) => void
  ): Service;
  getSlots(): Slot[];
}

interface CompanionAdsService extends Service {
  enableSyncLoading(): void;
  setRefreshUnfilledSlots(value: boolean): void;
}

interface ContentService extends Service {
  setContent(slot: Slot, content: string): void;
}

export interface PubAdsService extends Service {
  /**
   * Removes the ads from the given slots and replaces them with blank content.
   *
   * @param opt_slots The array of slots to clear. Array is optional; all slots will be cleared if it is unspecified.
   */
  clear(opt_slots?: Slot[]): boolean;

  /**
   * Clears all page-level ad category exclusion labels.
   */
  clearCategoryExclusions(): PubAdsService;

  /**
   * Clears custom targeting parameters for a specific key or for all keys.
   *
   * @param opt_key Targeting parameter key. The key is optional; all targeting parameters will be cleared if it is unspecified.
   */
  clearTargeting(opt_key?: string): PubAdsService;

  /**
   * Enables collapsing of slot divs so that they don't take up any space on the page when there is no ad content to display.
   *
   * @param opt_collapseBeforeAdFetch Whether to collapse the slots even before the ads are fetched. This parameter is optional; if not provided, false will be used as the default value.
   */
  collapseEmptyDivs(opt_collapseBeforeAdFetch?: boolean): boolean;

  /**
   * Disables requests for ads on page load, but allows ads to be requested with a `googletag.pubads().refresh()` call.
   */
  disableInitialLoad(): void;

  /**
   * Constructs and displays an ad slot with the given ad unit path and size.
   *
   * @param adUnitPath The ad unit path of slot to be rendered.
   * @param size Width and height of the slot.
   * @param opt_div Either the ID of the div containing the slot or the div element itself.
   * @param opt_clickUrl The click URL to use on this slot.
   */
  display(
    adUnitPath: string,
    size: GeneralSize,
    opt_div?: string | Element,
    opt_clickUrl?: string
  ): Slot;

  /**
   * Enables lazy loading in GPT as defined by the config object.
   *
   * @param opt_config Configuration object allows customization of lazy loading behavior. Any omitted configurations will use a default set by Google that will be tuned over time. To disable a particular setting, such as a fetching margin, set the value to -1.
   *
   * fetchMarginPercent is the minimum distance from the current viewport a slot must be before we fetch the ad as a percentage of viewport size. 0 means "when the slot enters the viewport", 100 means "when the ad is 1 viewport away", and so on.
   *
   * renderMarginPercent is the minimum distance from the current viewport a slot must be before we render an ad. This allows for prefetching the ad, but waiting to render and download other subresources. The value works just like fetchMarginPercent as a percentage of viewport.
   *
   * mobileScaling is a multiplier applied to margins on mobile devices. This allows varying margins on mobile vs. desktop. For example, a mobileScaling of 2.0 will multiply all margins by 2 on mobile devices, increasing the minimum distance a slot can be before fetching and rendering.
   */
  enableLazyLoad(opt_config?: LazyLoadOptionsConfig): void;

  /**
   * Enables single request mode for fetching multiple ads at the same time.
   */
  enableSingleRequest(): boolean;

  /**
   * Signals to GPT that video ads will be present on the page.
   */
  enableVideoAds(): void;

  /**
   * Returns the value for the AdSense attribute associated with the given key.
   *
   * @param key Name of the attribute to look for.
   */
  get(key: string): string | null;

  /**
   * Returns the attribute keys that have been set on this service.
   */
  getAttributeKeys(): string[];

  /**
   * Returns a specific custom service-level targeting parameter that has been set.
   *
   * @param key The targeting key to look for.
   */
  getTargeting(key: string): string[];

  /**
   * Returns the list of all custom service-level targeting keys that have been set.
   */
  getTargetingKeys(): string[];

  /**
   * Returns whether or not initial requests for ads was successfully disabled by a previous disableInitialLoad call.
   */
  isInitialLoadDisabled(): boolean;

  /**
   * Fetches and displays new ads for specific or all slots on the page.
   *
   * @param opt_slots The slots to refresh. Array is optional; all slots will be refreshed if it is unspecified.
   * @param opt_options Configuration options associated with this refresh call. changeCorrelator specifies whether or not a new correlator is to be generated for fetching ads. Our ad servers maintain this correlator value briefly (currently for 30 seconds, but subject to change), such that requests with the same correlator received close together will be considered a single page view. By default a new correlator is generated for every refresh. Note that this option has no effect on GPT's long-lived pageview, which automatically reflects the ads currently on the page and has no expiration time.
   */
  refresh(
    opt_slots?: Slot[],
    opt_options?: { changeCorrelator: boolean }
  ): void;

  /**
   * Sets values for AdSense attributes that apply to all ad slots under the publisher ads service.
   *
   * @param key The name of the attribute.
   * @param value Attribute value.
   */
  set(key: string, value: string): PubAdsService;

  /**
   * Sets a page-level ad category exclusion for the given label name.
   *
   * @param categoryExclusion The ad category exclusion label to add.
   */
  setCategoryExclusion(categoryExclusion: string): PubAdsService;

  /**
   * Enables and disables horizontal centering of ads.
   *
   * @param centerAds true to center ads, false to left-align them.
   */
  setCentering(centerAds: boolean): void;

  /**
   * Sets options for ignoring Google Ad Manager cookies on the current page.
   *
   * @param cookieOptions The cookie options to set. Possible values are:
   *
   * 0: Enables Google Ad Manager cookies on ad requests on the page. This option is set by default.
   *
   * 1: Ignores Google Ad Manager cookies on subsequent ad requests and prevents cookies from being created on the page. Note that cookies will not be ignored on certain pingbacks and that this option will disable features that rely on cookies, such as dynamic allocation.
   */
  setCookieOptions(cookieOptions: number): PubAdsService;

  /**
   * Configures whether all ads on the page should be forced to be rendered using a SafeFrame container.
   *
   * @param forceSafeFrame true to force all ads on the page to be rendered in SafeFrames and false to change the previous setting to false. Setting this to false when unspecified earlier, won't change anything.
   */
  setForceSafeFrame(forceSafeFrame: boolean): PubAdsService;

  /**
   * Passes location information from websites so you can geo-target line items to specific locations.
   *
   * @param address Freeform address.
   */
  setLocation(address: string): PubAdsService;

  /**
   * Allows configuration of all privacy settings from a single API using a config object.
   * @param privacySettings
   */
  setPrivacySettings(privacySettings: PrivacySettingsConfig): Slot;

  /**
   * Sets the value for the publisher-provided ID.
   *
   * @param ppid An alphanumeric ID provided by the publisher with a recommended maximum of 150 characters.
   */
  setPublisherProvidedId(ppid: string): PubAdsService;

  /**
   * Configures whether the page should request personalized or non-personalized ads.
   *
   * @param nonPersonalizedAds 0 for personalized ads, 1 for non-personalized ads.
   */
  setRequestNonPersonalizedAds(nonPersonalizedAds: 0 | 1): PubAdsService;

  /**
   * Sets the page-level preferences for SafeFrame configuration.
   *
   * @param config The configuration object.
   */
  setSafeFrameConfig(config: SafeFrameConfig): PubAdsService;

  /**
   * Sets a custom targeting parameter for this slot.
   *
   * @param key Targeting parameter key.
   * @param value Targeting parameter value or array of values.
   */
  setTargeting(key: string, value: string | string[]): PubAdsService;

  /**
   * Sets the video content information to be sent along with the ad requests for targeting and content exclusion purposes.
   *
   * @param videoContentId The video content ID.
   * @param videoCmsId The video CMS ID.
   */
  setVideoContent(videoContentId: string, videoCmsId: string): void;

  /**
   * Changes the correlator that is sent with ad requests, effectively starting a new page view.
   */
  updateCorrelator(): PubAdsService;
}

interface SizeMappingBuilder {
  /**
   * Adds a mapping from a single-size array representing the viewport to either a single-size array or a multi-size array representing the slot.
   *
   * @param viewportSize The size of the viewport for this mapping entry.
   * @param slotSize The sizes of the slot for this mapping entry.
   */
  addSize(
    viewportSize: SingleSizeArray,
    slotSize: GeneralSize
  ): SizeMappingBuilder;

  /**
   * Builds a size map specification from the mappings added to this builder.
   */
  build(): SizeMappingArray;
}

interface Event {
  serviceName: string;
  slot: Slot;
}

interface SlotRenderEndedEvent extends Event {
  advertiserId?: number | undefined;
  campaignId?: number | undefined;
  creativeId?: number | undefined;
  isEmpty: boolean;
  lineItemId?: number | undefined;
  size: number[] | string;
  sourceAgnosticCreativeId?: number | undefined;
  sourceAgnosticLineItemId?: number | undefined;
}

// tslint:disable-next-line:no-empty-interface
interface SlotRequestedEvent extends Event {}

// tslint:disable-next-line:no-empty-interface
interface SlotResponseReceived extends Event {}

interface SlotVisibilityChangedEvent extends Event {
  inViewPercentage: number;
}

export interface Slot {
  /**
   * Adds a service to this slot.
   *
   * @param service The service to be added.
   */
  addService(service: Service): Slot;

  /**
   * Clears all slot-level ad category exclusion labels for this slot.
   */
  clearCategoryExclusions(): Slot;

  /**
   * Clears specific or all custom slot-level targeting parameters for this slot.
   *
   * @param opt_key Targeting parameter key. The key is optional; all targeting parameters will be cleared if it is unspecified.
   */
  clearTargeting(opt_key?: string): Slot;

  /**
   * Sets an array of mappings from a minimum viewport size to slot size for this slot.
   *
   * @param sizeMapping Array of size mappings. You can use `googletag.SizeMappingBuilder` to create it. Each size mapping is an array of two elements: `googletag.SingleSizeArray` and `googletag.GeneralSize`.
   */
  defineSizeMapping(sizeMapping: SizeMappingArray): Slot;

  /**
   * Returns the value for the AdSense attribute associated with the given key.
   *
   * @param key Name of the attribute to look for.
   */
  get(key: string): string | null;

  /**
   * Returns the full path of the ad unit, with the network code and ad unit path.
   */
  getAdUnitPath(): string;

  /**
   * Returns the list of attribute keys set on this slot.
   */
  getAttributeKeys(): string[];

  /**
   * Returns the ad category exclusion labels for this slot.
   */
  getCategoryExclusions(): string[];

  /**
   * Returns the ad response information.
   */
  getResponseInformation(): ResponseInformation;

  /**
   * Returns the id of the slot element provided when the slot was defined.
   */
  getSlotElementId(): string;

  /**
   * Returns a specific custom targeting parameter set on this slot.
   *
   * @param key The targeting key to look for.
   */
  getTargeting(key: string): string[];

  /**
   * Returns the list of all custom targeting keys set on this slot.
   */
  getTargetingKeys(): string[];

  /**
   * Sets a value for an AdSense attribute on a particular ad slot.
   *
   * @param key The name of the attribute.
   * @param value Attribute value.
   */
  set(key: string, value: string): Slot;

  /**
   * Sets a slot-level ad category exclusion label on this slot.
   *
   * @param categoryExclusion The ad category exclusion label to add.
   */
  setCategoryExclusion(categoryExclusion: string): Slot;

  /**
   * Sets the click URL to which users will be redirected after clicking on the ad.
   *
   * @param value The click URL to set.
   */
  setClickUrl(value: string): Slot;

  /**
   * Sets whether the slot div should be hidden when there is no ad in the slot.
   *
   * @param collapse Whether to collapse the slot if no ad is returned.
   * @param opt_collapseBeforeAdFetch Whether to collapse the slot even before an ad is fetched. Ignored if collapse is not true.
   */
  setCollapseEmptyDiv(
    collapse: boolean,
    opt_collapseBeforeAdFetch?: boolean
  ): Slot;

  /**
   * Configures whether ads in this slot should be forced to be rendered using a SafeFrame container.
   *
   * @param forceSafeFrame true to force all ads in this slot to be rendered in SafeFrames and false to opt-out of a page-level setting (if present). Setting this to false when not specified at page-level, won't change anything.
   */
  setForceSafeFrame(forceSafeFrame: boolean): Slot;

  /**
   * Sets the slot-level preferences for SafeFrame configuration.
   *
   * @param config The configuration object.
   */
  setSafeFrameConfig(config: SafeFrameConfig): Slot;

  /**
   * Sets a custom targeting parameter for this slot.
   *
   * @param key Targeting parameter key.
   * @param value Targeting parameter value or array of values.
   */
  setTargeting(key: string, value: string | string[]): Slot;

  /**
   * Sets custom targeting parameters for this slot, from a key:value map in a JSON object.
   *
   * @param map Targeting parameter key:value map.
   */
  updateTargetingFromMap(map: object): Slot;
}

export interface Googletag {
  /**
   * Flag indicating that GPT API is loaded and ready to be called.
   */
  apiReady: boolean;

  /**
   * Reference to the global command queue for asynchronous execution of GPT-related calls.
   */
  cmd: CommandArray;

  /**
   * Returns a reference to the companion ads service.
   */
  companionAds(): CompanionAdsService;

  /**
   * Returns a reference to the content service.
   */
  content(): ContentService;

  /**
   * Constructs an out-of-page (interstitial) ad slot with the given ad unit path.
   *
   * @param adUnitPath Full ad unit path with the network code and ad unit code.
   * @param opt_div ID of the div that will contain this ad unit or OutOfPageFormat.
   */
  defineOutOfPageSlot(adUnitPath: string, opt_div?: string): Slot;

  /**
   * Constructs an ad slot with a given ad unit path and size and associates it with the ID of a div element on the page that will contain the ad.
   *
   * @param adUnitPath Full ad unit path with the network code and unit code.
   * @param size Width and height of the added slot. This is the size that is used in the ad request if no responsive size mapping is provided or the size of the viewport is smaller than the smallest size provided in the mapping.
   * @param opt_div ID of the div that will contain this ad unit.
   */
  defineSlot(adUnitPath: string, size: GeneralSize, opt_div?: string): Slot;

  /**
   * Destroys the given slots, removing all related objects and references of those slots from GPT.
   * @param opt_slots The array of slots to destroy. Array is optional; all slots will be destroyed if it is unspecified.
   */
  destroySlots(opt_slots?: Slot[]): boolean;

  /**
   * Disables the Google Publisher Console.
   */
  disablePublisherConsole(): void;

  /**
   * Instructs slot services to render the slot.
   *
   * @param divOrSlot Either the ID of the div element containing the ad slot or the div element, or the slot object. If a div element is provided, it must have an 'id' attribute which matches the ID passed into `googletag.defineSlot()`.
   */
  display(divOrSlot?: string | Element | Slot): void;

  /**
   * Enables all GPT services that have been defined for ad slots on the page.
   */
  enableServices(): void;

  /**
   * Returns the current version of GPT.
   */
  getVersion(): string;

  /**
   * Opens the Google Publisher Console.
   *
   * @param opt_div ID of the div element containing the ad slot.
   */
  openConsole(opt_div?: string): void;

  /**
   * Returns a reference to the pubads service.
   */
  pubads(): PubAdsService;

  /**
   * Flag indicating that Pubads service is enabled, loaded and fully operational.
   */
  pubadsReady: boolean;

  /**
   * Sets that title for all ad container iframes created by pubads service, from this point onwards.
   *
   * @param title The title to set.
   */
  setAdIframeTitle(title: string): void;

  /**
   * Creates a new SizeMappingBuilder.
   */
  sizeMapping(): SizeMappingBuilder;
}
