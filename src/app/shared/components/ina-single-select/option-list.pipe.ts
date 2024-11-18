import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByKeywords',
})
export class OptionListFilterPipe implements PipeTransform {
  transform(optionList: any[], searchWords: string, label: string): any[] {
    if (!searchWords) return optionList;
    searchWords = searchWords.toLowerCase();
    return optionList.filter((option) => {
      return option[label].toLowerCase().includes(searchWords);
    });
  }
}
