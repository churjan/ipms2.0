import { Pipe, PipeTransform } from '@angular/core';
import * as moment  from 'moment';

@Pipe({ name: 'time' })


export class TimePipe implements PipeTransform {

    constructor(){}
        
    transform(value: string, args: string = "YYYY-MM-DD HH:mm:ss"): string {
        if(!value) return null
        return moment(value).format(args)
    }
}