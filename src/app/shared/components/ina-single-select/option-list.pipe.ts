import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByKeywords',
})
export class FilterByKeywordsPipe implements PipeTransform {
  transform(optionList: any[], searchWords: string, label: string): any[] {
    if (!searchWords) return optionList;
    searchWords = searchWords.toLowerCase();
    return optionList.filter((option) => {
      return option[label].toLowerCase().includes(searchWords);
    });
  }
}

@Pipe({
  name: 'displayLabel',
})
export class DisplayLabelPipe implements PipeTransform {
  transform(option: any, label: string, secondaryLabel: string): string {
    console.log(option, label, secondaryLabel);
    if (secondaryLabel) {
      return `${option[label]}[${option[secondaryLabel]}]`;
    } else {
      return option[label];
    }
  }
}
