import { Injectable } from '@angular/core';
import { AppConfig } from '~/shared/services/AppConfig.service';
import { RequestService } from '~/shared/services/request.service';
import { Subject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class LayoutStructureDisplayService {
    catalogChange$ = new Subject<any>();

    constructor(private request: RequestService) {}

    fetchList() {
        return new Promise((resolve, reject) => {
            this.request
                .get(
                    '/admin/LayoutStructure/getlist'
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
