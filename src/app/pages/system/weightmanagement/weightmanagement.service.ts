import { Injectable } from '@angular/core';
import { RequestService } from '~/shared/services/request.service';

@Injectable({
    providedIn: 'root',
})
export class WeightmanagementService {
    constructor(private request:RequestService) {}

    fetchList(params = {}) {
        return new Promise((resolve, reject) => {
            this.request
                .get('admin/weight/getlist',params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    editData(data = {}) {
        return new Promise((resolve, reject) => {
            this.request
                .put('admin/weight',data)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    
}
