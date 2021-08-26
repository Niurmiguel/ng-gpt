import { Component, EventEmitter, ViewChild } from '@angular/core';
import { NgGptVideoDirective } from 'projects/ng-gpt/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Angular-GPT';

  @ViewChild(NgGptVideoDirective) gptVideo: NgGptVideoDirective;
  adInput = new EventEmitter<any>();

  refreshed(event: any) {
    console.log(event, typeof event);
    if (event.type === 'renderEnded') {
      console.log(event.data.isEmpty, event.data.size);
    }
  }

  adEvent(event: any) {
    console.log(event);
    if (event.type === 'complete') {
      // hide ad container
      this.gptVideo.adContainer.style.zIndex = '-1';
    }
    if (event.type === 'start') {
      // show ad container
      this.gptVideo.adContainer.style.zIndex = '1';
    }
  }
}
