import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, filterKey?: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter((item) => {
      // 如果没有指定过滤键，则默认检查所有值
      if (!filterKey) {
        const values = Object.values(item);
        return values.some((value) => {
          return String(value).toLowerCase().includes(searchText);
        });
      } else {
        // 如果指定了过滤键，则只检查该键的值
        const value = item[filterKey];
        return String(value).toLowerCase().includes(searchText);
      }
    });
  }
}
