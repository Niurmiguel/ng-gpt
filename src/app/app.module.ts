import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgGptModule } from 'projects/ng-gpt/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgGptModule.forRoot({
      centering: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
