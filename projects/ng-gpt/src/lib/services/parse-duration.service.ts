import { Injectable } from '@angular/core';

class GPTDurationError extends Error {
  constructor(interval: number | string) {
    super(`Invalid interval: '${interval}'ls`);
  }
}

@Injectable()
export class ParseDurationService {
  convertToMilliseconds(time: number, unit: string) {
    console.assert(/^(m?s|min|h)$/g.test(unit));

    if (unit === 'ms') {
      return time;
    }
    if (unit === 's') {
      return time * 1000;
    }
    if (unit === 'min') {
      return time * 60 * 1000;
    }

    return time * 60 * 60 * 1000;
  }

  convert(match: any) {
    const time = parseFloat(match[1]);

    if (match.length === 2) {
      return time;
    }

    return this.convertToMilliseconds(time, match[2]);
  }

  parseDuration(interval: any) {
    if (interval === undefined || interval === null) {
      throw new GPTDurationError(interval);
    }

    if (typeof interval === 'number') {
      return interval;
    }

    if (typeof interval !== 'string') {
      throw new TypeError(`'${interval}' must be of number or string type`);
    }

    const match = interval.match(/((?:\d+)?.?\d+)(m?s|min|h)?/);

    if (!match) {
      throw new GPTDurationError(interval);
    }

    return this.convert(match);
  }
}
