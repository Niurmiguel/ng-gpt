import { Injectable } from '@angular/core';

@Injectable()
export class HttpErrorService {
  httpError(response: any, message: string) {
    console.log(`Error (${response.status}) ${message ? message : ''}`);
  }

  isErrorCode = function (code: number | string) {
    if (typeof code === 'number') {
      return !(code >= 200 && code < 300);
    }
    return code[0] !== '2';
  };
}
