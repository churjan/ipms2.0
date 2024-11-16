import { Injectable } from '@angular/core';
import { RequestService } from '~/shared/services/request.service';

@Injectable({
    providedIn: 'root',
})
export class PriceInfoService {
    constructor(private request: RequestService) {}

    editPriceInfo(params) {
        return new Promise((resolve, reject) => {
            this.request
                .post('/admin/wages', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }


}
