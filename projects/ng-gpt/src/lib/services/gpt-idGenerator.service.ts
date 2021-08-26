import { Injectable } from '@angular/core';

@Injectable()
export class GptIDGeneratorService {
  private generatedIDs: { [index: string]: any } = {};

  generateID(type = 'gpt-ad'): string {
    let id = '';

    do {
      const number = Math.random().toString().slice(2);
      id = type + '-' + number;
    } while (id in this.generatedIDs);

    this.generatedIDs[id] = true;

    return id;
  }

  gptIDGenerator(element: HTMLElement): string {
    if (element && element.id && !(element.id in this.generatedIDs)) {
      return element.id;
    }

    const id = this.generateID(element.tagName.toLowerCase());
    if (element) {
      element.id = id;
    }

    return id;
  }

  isTaken(id: string): boolean {
    return id in this.generatedIDs;
  }

  isUnique(id: string): boolean {
    return !this.isTaken(id);
  }
}
