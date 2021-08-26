import { Injectable } from '@angular/core';
import { HttpErrorService } from '.';

@Injectable()
export class ScriptInjectorService {
  constructor(private httpError: HttpErrorService) {}

  private completeURL(url: string) {
    const ssl = document.location.protocol === 'https:';
    return (ssl ? 'https:' : 'http:') + url;
  }

  private createScript(url: string) {
    const script = document.createElement('script');

    script.async = true;
    script.type = 'text/javascript';
    script.src = this.completeURL(url);

    return script;
  }

  private promiseScript(script: any, url: string) {
    const promise = new Promise((resolve, reject) => {
      script.onload = () => {
        resolve(script);
      };
      script.onerror = () => {
        reject({
          path: url,
          loaded: false,
        });
      };
    });

    promise.catch((response: any) => {
      this.httpError.httpError({ status: 400 }, `loading script "${url}"`);
    });

    return promise;
  }

  injectScript(script: any) {
    const head = document.head || document.querySelector('head');
    head.appendChild(script);
  }

  scriptInjector(url: string) {
    const script = this.createScript(url);
    this.injectScript(script);
    return this.promiseScript(script, url);
  }
}
