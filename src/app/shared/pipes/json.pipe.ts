import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'json' })


export class JsonPipe implements PipeTransform {

    constructor(){}
        
    transform(value: string, args?: any): string {
        if(!value) return null
        return JSON.stringify(JSON.parse(value), null, "\t")
    }
}