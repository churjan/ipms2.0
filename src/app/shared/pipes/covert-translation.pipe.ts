import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'covertTranslation',
})
export class CovertTranslationPipe implements PipeTransform {
    transform(value: string, ...args): string {
        let newValue = value;
        args.forEach((arg) => {
            newValue = newValue.replace('_', arg);
        });
        return newValue;
    }
}
