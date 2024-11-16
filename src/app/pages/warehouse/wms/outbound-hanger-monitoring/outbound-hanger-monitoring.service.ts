import { Injectable } from '@angular/core';
import { RequestService } from '~/shared/services/request.service';

@Injectable({
    providedIn: 'root',
})
export class OutboundHangerMonitoringService {
    constructor(private request: RequestService) {}

    fetchStationList(params) {
        return new Promise((resolve, reject) => {
            this.request
                .get('/admin/w_LayoutStructure/getlist', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchList(params) {
        return new Promise((resolve, reject) => {
            this.request
                .get('/admin/w_WarehouseOutMaster/extend/GetExtendByVO', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchDetailList(params) {
        return new Promise((resolve, reject) => {
            this.request
                .get('/admin/w_WarehouseOutDetail/getlist', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    outboundClose(params) {
        return new Promise((resolve, reject) => {
            this.request
                .post('/admin/w_WarehouseOutMaster/extend/close', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    outboundDetailClose(params) {
        return new Promise((resolve, reject) => {
            this.request
                .post('/admin/w_WarehouseOutDetail/extend/close', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
