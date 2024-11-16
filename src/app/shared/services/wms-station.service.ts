import { Injectable } from '@angular/core';
import { RequestService } from '~/shared/services/request.service';
import { CommonService } from '~/shared/services/http/common.service';

@Injectable({
    providedIn: 'root',
})
export class WmsStationService {
    stationList: any[] = [];
    curStation = null;
    get stationKey() {
        return this.curStation ? this.curStation.key : null;
    }
    
    constructor(
        private request: RequestService,
        private commonService: CommonService
    ) {}

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

    async fetchStation() {
        let stationType;
        await this.commonService
            .dictionary('packingstationtype')
            .then((data: any[]) => {
                stationType = data[0].code;
            });

        const params = {
            blst_group: 'Station',
            stationtype: stationType,
        };
        await this.fetchStationList(params).then((data: any[]) => {
            data.forEach(
                (item) => (item.fullName = `${item.name}(${item.code})`)
            );
            this.stationList = data;

            // 取出上次选择的站点
            const curStation = JSON.parse(
                sessionStorage.getItem('wms_curStation')
            );
            if (curStation) {
                this.curStation = curStation;
            }
        });
    }
}
