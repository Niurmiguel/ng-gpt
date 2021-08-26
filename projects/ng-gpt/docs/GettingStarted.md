## Getting Started

The simplest form of Angular GPT ad looks like the following

```javascript
// app.module.ts

import { GptModule } from 'ng-gpt';

@NgModule({
  declarations: [AppComponent],
  imports: [
    GptModule.forRoot({
      idleLoad: true,
      enableVideoAds: true,
      personalizedAds: false,
      singleRequestMode: false,
      limitedAds: false,
      ppid: '',
      centering: true,
      onSameNavigation: 'refresh',
      globalTargeting: {
        food: ['chicken', 'meatballs'],
      },
      enableLazyLoad: {
        fetchMarginPercent: 500,
        renderMarginPercent: 200,
        mobileScaling: 2.0,
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
```

```html
<!-- app.component.html -->

<gpt-ad adUnit="/35096353/pub-showcase" [sizes]="[[728, 90]]"></gpt-ad>
```

`adUnit` is a required prop and either `sizes` and/or `sizeMapping` prop are needed to give the size information.

## Responsive ad

If you pass `sizeMapping` props instead of `slotSize`, Angular GPT listens for the viewport width change and refreshes an ad when the break point is hit.

```html
<!-- app.component.html -->

<gpt-ad
  adUnit="/35096353/pub-showcase"
  [sizeMapping]="[
    { viewport: [1024, 768], sizes: [[728, 90],[300, 250]] },
    { viewport: [900, 768], sizes: [[300, 250],[210, 60]] }
    ]"
></gpt-ad>
```

## Lazy render

Angular GPT by default renders an ad when its bounding box is fully inside the viewport. You can disable this setting and custom.

## ForceSafeFrame

Configures whether all ads on the page should be forced to be rendered using a SafeFrame container.

```html
<!-- app.component.html -->

<gpt-ad
  adUnit="/35096353/pub-showcase"
  [sizes]="[[728, 90]]"
  [forceSafeFrame]="true"
></gpt-ad>
```

## SafeFrameConfig

Sets the slot-level preferences for SafeFrame configuration.

```html
<!-- app.component.html -->

<gpt-ad
  adUnit="/35096353/pub-showcase"
  [sizes]="[[728, 90]]"
  [safeFrameConfig]="{
      sandbox: true,
      allowOverlayExpansion: true,
      allowPushExpansion: true,
      useUniqueDomain: true
    }"
></gpt-ad>
```

- `sandbox` - true if SafeFrame should use the HTML5 sandbox attribute to prevent top level navigation.
- `allowOverlayExpansion` - true to allow expansion by overlay and false otherwise.
- `allowPushExpansion` - true to allow expansion by push and false otherwise.
- `useUniqueDomain` - Whether to use a unique subdomain for SafeFrame for Reservation creatives.

## CollapseEmptyDivs

Enables collapsing of slot divs so that they don't take up any space on the page when there is no ad content to display.

```html
<!-- app.component.html -->

<gpt-ad
  adUnit="/35096353/pub-showcase"
  [sizes]="[[728, 90]]"
  [collapseEmptyDivs]="true"
></gpt-ad>
```

## TargetingArguments

Targeting parameter array of values.

```html
<!-- app.component.html -->

<gpt-ad
  adUnit="/35096353/pub-showcase"
  [sizes]="[[728, 90]]"
  [targetingArguments]="{ categories: ['restaurantes', 'abogados'] }"
></gpt-ad>
```

## Video ads with `IMA SDK`

```html
<!-- app.component.html -->
<gpt-video
  [sizes]="[640, 480]"
  [adActions]="adInput"
  (adEvents)="adEvent($event)"
  adTagUrl="https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&cmsid=496&vid=short_onecue&correlator="
>
  <video
    class="video-js"
    controls
    preload="auto"
    data-setup="{}"
    poster="https://img.rnudah.com/images/77/7717002808.jpg"
  >
    <source src="//s0.2mdn.net/4253510/google_ddm_animation_480P.mp4" />
  </video>
  <div class="ad-container" (click)="adInput.emit('play')"></div>
</gpt-video>
```

You at need to pass `adTagUrl` and `sizes`
