import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayItemJoin',
})
export class ArrayItemJoinPipe implements PipeTransform {
  transform(
    arr: Array<Record<string, any>> | undefined,
    itemKey: string,
    split = ',',
    ...args: unknown[]
  ): string | undefined {
    return arr?.map((item) => item[itemKey] as string | number).join(split);
  }
}
