import { environment } from '@/environments/environment';
import { Pipe, PipeTransform } from '@angular/core';
import { AppService } from '../services/app.service';
import { AppConfig } from '../services/AppConfig.service';
import { RequestService } from '../services/request.service';


@Pipe({ name: 'i18n' })


export class I18nPipe implements PipeTransform {

    constructor(private request: RequestService,
        private appService: AppService) { }

    transform(value: string, args?: any): string {
        return this.appService.translate(value, args)
    }
}