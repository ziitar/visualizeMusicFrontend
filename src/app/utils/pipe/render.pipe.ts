import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'render',
})
export class RenderPipe<T extends any[]> implements PipeTransform {
  transform(fn: (...args: T) => string, ...args: T): string {
    return fn(...args);
  }
}
