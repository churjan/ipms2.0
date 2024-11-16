import { Pipe, PipeTransform } from '@angular/core';
import { UtilService } from '../services/util.service';


@Pipe({ name: 'datetime' })


export class DateTimePipe implements PipeTransform {

    constructor() { }

    transform(value, sFormat?: any): string {
        if(!value) return null
        return UtilService.dateFormat(new Date(value), sFormat)
    }
}