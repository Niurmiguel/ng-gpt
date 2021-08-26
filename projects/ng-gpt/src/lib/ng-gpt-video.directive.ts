import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { loadImaSdk, google } from '@alugha/ima';
import { GptIDGeneratorService } from './services';

@Directive({ selector: 'gpt-video' })
export class NgGptVideoDirective implements OnInit {
  @Input() id: string;
  @Input() adTagUrl: string;
  @Input() sizes: [number, number];
  @Output() adEvents = new EventEmitter<any>();
  @Input() adActions: EventEmitter<'play' | 'pause' | 'resume'>;

  contentPlayer: HTMLVideoElement;
  adContainer: HTMLElement;

  private contentCompleteCalled: boolean;
  private adDisplayContainer: google.ima.AdDisplayContainer;
  private adsLoader: google.ima.AdsLoader;
  private adsManager: google.ima.AdsManager;
  private adsDone = false;
  private ima: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private gptIDGenerator: GptIDGeneratorService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const el = this.elementRef.nativeElement;

      if (!this.id) {
        this.gptIDGenerator.gptIDGenerator(el);
      }

      this.contentPlayer = el.querySelector('video');
      this.renderer.setAttribute(
        this.contentPlayer,
        'width',
        this.sizes[0].toString()
      );
      this.renderer.setAttribute(
        this.contentPlayer,
        'height',
        this.sizes[1].toString()
      );

      this.adContainer = el.querySelector('.ad-container');
      if (!this.adContainer) {
        this.adContainer = this.renderer.createElement('div');
        this.renderer.addClass(this.adContainer, 'ad-container');
        this.renderer.appendChild(el, this.adContainer);
      }

      // ima setup
      loadImaSdk().then((ima) => {
        this.ima = ima;
        return this.setUpIMA();
      });

      this.adActions.subscribe((act) => {
        switch (act) {
          case 'play':
            this.play();
            break;
          case 'pause':
            this.pause();
            break;
          case 'resume':
            this.resume();
            break;
        }
      });
    }
  }

  play() {
    if (!this.adsDone) {
      this.initialUserAction();
      this.loadAds();
      this.adsDone = true;
    }
  }

  pause() {
    if (this.adsManager) {
      this.adsManager.pause();
    }
  }

  resume() {
    if (this.adsManager) {
      this.adsManager.resume();
    }
  }

  setUpIMA() {
    // Create the ad display container.
    this.adDisplayContainer = new this.ima.AdDisplayContainer(
      this.adContainer,
      this.contentPlayer
    );
    // Create ads loader.
    this.adsLoader = new this.ima.AdsLoader(this.adDisplayContainer);
    // Listen and respond to ads loaded and error events.
    this.adsLoader.addEventListener(
      this.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      (event) => this.onAdsManagerLoaded(event),
      false
    );
    this.adsLoader.addEventListener(
      this.ima.AdErrorEvent.Type.AD_ERROR,
      (event) => this.onAdError(event),
      false
    );

    // An event listener to tell the SDK that our content video
    // is completed so the SDK can play any post-roll ads.
    this.contentPlayer.onended = () => {
      this.contentEnded();
    };
  }

  initialUserAction() {
    this.adDisplayContainer.initialize();
    this.contentPlayer.load();
  }

  requestAds(adTagUrl: string) {
    const adsRequest = new this.ima.AdsRequest();
    adsRequest.adTagUrl = adTagUrl;
    adsRequest.linearAdSlotWidth = this.sizes[0];
    adsRequest.linearAdSlotHeight = this.sizes[1];
    adsRequest.nonLinearAdSlotWidth = this.sizes[0];
    adsRequest.nonLinearAdSlotHeight = this.sizes[1];
    this.adsLoader.requestAds(adsRequest);
  }

  contentEnded() {
    this.contentCompleteCalled = true;
    this.adsLoader.contentComplete();
  }

  onAdsManagerLoaded(adsManagerLoadedEvent: any) {
    const adsRenderingSettings = new this.ima.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    this.adsManager = adsManagerLoadedEvent.getAdsManager(
      this.contentPlayer,
      adsRenderingSettings
    );
    this.startAdsManager(this.adsManager);
  }

  startAdsManager(adsManager: google.ima.AdsManager) {
    // Attach the pause/resume events.
    adsManager.addEventListener(
      this.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
      () => this.onContentPauseRequested(),
      false
    );
    adsManager.addEventListener(
      this.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
      () => this.onContentResumeRequested(),
      false
    );
    // Handle errors.
    adsManager.addEventListener(
      this.ima.AdErrorEvent.Type.AD_ERROR,
      (event: google.ima.AdErrorEvent) => this.onAdError(event),
      false
    );
    const events = [
      this.ima.AdEvent.Type.ALL_ADS_COMPLETED,
      this.ima.AdEvent.Type.CLICK,
      this.ima.AdEvent.Type.COMPLETE,
      this.ima.AdEvent.Type.FIRST_QUARTILE,
      this.ima.AdEvent.Type.LOADED,
      this.ima.AdEvent.Type.MIDPOINT,
      this.ima.AdEvent.Type.PAUSED,
      this.ima.AdEvent.Type.STARTED,
      this.ima.AdEvent.Type.THIRD_QUARTILE,
    ];
    events.forEach((event) =>
      adsManager.addEventListener(
        event,
        (adEvent) => this.onAdEvent(adEvent),
        false
      )
    );

    adsManager.init(this.sizes[0], this.sizes[1], this.ima.ViewMode.NORMAL);

    adsManager.start();
  }

  onContentPauseRequested() {
    this.pauseForAd();
  }

  onContentResumeRequested() {
    // Without this check the video starts over from the beginning on a
    // post-roll's CONTENT_RESUME_REQUESTED
    if (!this.contentCompleteCalled) {
      this.resumeAfterAd();
    }
  }

  onAdEvent(adEvent: any) {
    console.log(typeof adEvent);

    if (adEvent.type === this.ima.AdEvent.Type.LOADED) {
      const ad = adEvent.getAd();
      if (!ad.isLinear()) {
        this.onContentResumeRequested();
      }
    }
    this.adEvents.emit(adEvent);
  }

  onAdError(adErrorEvent: any) {
    if (this.adsManager) {
      this.adsManager.destroy();
    }
    this.resumeAfterAd();
    this.adEvents.emit(adErrorEvent);
  }

  // application functions

  resumeAfterAd() {
    this.contentPlayer.play();
  }

  pauseForAd() {
    this.contentPlayer.pause();
  }

  loadAds() {
    this.requestAds(this.adTagUrl);
  }
}
