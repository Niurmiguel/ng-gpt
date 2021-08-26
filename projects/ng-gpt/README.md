# Angular GPT

A [Angular](https://github.com/angular/angular) implementation of the [Google Publisher Tags](https://developers.google.com/doubleclick-gpt/?hl=en).

## Installation

```bash
npm install --save ng-gpt
```

## Getting Started

Import Angular GPT and pass props to the component.

```javascript
// app.module.ts
import { GptModule } from 'ng-gpt';
...
@NgModule({
  declarations: [AppComponent],
  imports: [
    GptModule.forRoot({
      idleLoad: true,
      enableVideoAds: true,
      personalizedAds: false,
      singleRequestMode: false,
      cookies: false,
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
<gpt-ad
  id="1625556673407-0"
  adUnit="/35096353/pub-showcase"
  [sizes]="[[728, 90]]"
  [sizeMapping]="[
    { viewport: [1024, 768], sizes: [[728, 90],[300, 250]] },
    { viewport: [900, 768], sizes: [[300, 250],[210, 60]] }
    ]"
  [targetingArguments]="{ categories: ['restaurantes', 'abogados'] }"
  [collapseEmptyDivs]="true"
></gpt-ad>
```

You at least need to pass `adUnit` and one of `sizes` and `sizeMapping`.

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

## Documentation

- [Getting Started](/projects/ng-gpt/docs/GettingStarted.md) A more detailed Getting Started Guide

## To run examples:

1. Clone this repo
2. Run `npm install`
3. Run `ng serve` or `npm start` for server side rendering.
4. Point your browser to http://localhost:4200

## License

MIT
