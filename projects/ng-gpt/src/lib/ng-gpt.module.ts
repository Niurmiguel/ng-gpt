import { NgModule, ModuleWithProviders } from '@angular/core';
import { GptConfig, GPT_CONFIG } from './gpt.config';
import { NgGptAdDirective } from './ng-gpt-ad.directive';
import { NgGptVideoDirective } from './ng-gpt-video.directive';
import {
  HttpErrorService,
  ScriptInjectorService,
  IdleService,
  PubadsSetConfigService,
  GptRefreshService,
  ParseDurationService,
  GptIDGeneratorService,
} from './services';

@NgModule({
  declarations: [NgGptAdDirective, NgGptVideoDirective],
  providers: [
    HttpErrorService,
    ScriptInjectorService,
    IdleService,
    PubadsSetConfigService,
    GptRefreshService,
    ParseDurationService,
    GptIDGeneratorService,
  ],
  exports: [NgGptAdDirective, NgGptVideoDirective],
})
export class NgGptModule {
  static forRoot(config?: GptConfig): ModuleWithProviders<NgGptModule> {
    return {
      ngModule: NgGptModule,
      providers: [
        ...(config && config.idleLoad === true ? [IdleService] : []),
        { provide: GPT_CONFIG, useValue: config || {} },
      ],
    };
  }
}
