import { Injectable } from '@angular/core';
import { AppService } from '../../../../shared/services/app.service';
import { RequestService } from '../../../../shared/services/request.service';

const api = {
    url: '/admin/w_WarehouseOutMaster',
    detail: "/admin/w_WarehouseOutDetail"
}

@Injectable({
    providedIn: 'root'
})
export class StockOutService {

    constructor(
        private request: RequestService,
        private appService: AppService
    ) { }


    list(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.get(api.url, params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    detail(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.get(api.detail, params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    tableColumns() {
        return [
            {
                title: this.appService.translate("wmsStockout.code"),
                code: "code"
            },
            /** {
                title: this.appService.translate("wmsStockout.expected_time"),
                code: "expected_time",
                width: "160px",
                tpl: "timeTpl"
            }, */
            {
                title: this.appService.translate("wmsStockout.state_name"),
                code: "state_name"
            },
            {
                title: this.appService.translate("wmsStockout.createtime"),
                code: "createtime",
                width: "160px",
                tpl: "timeTpl"
            }
        ]
    }

    detailTableColumns() {
        return [
            {
                title: this.appService.translate("wmsStockout.carrierid"),
                code: "carrierid"
            },
            {
                title: this.appService.translate("wmsStockout.bls_name"),
                code: "bls_name"
            },
            {
                title: this.appService.translate("wmsStockout.bls_code"),
                code: "bls_code"
            },
            {
                title: this.appService.translate("wmsStockout.out_bls_name"),
                code: "out_bls_name"
            },

            {
                title: this.appService.translate("wmsStockout.out_bls_code"),
                code: "out_bls_code"
            },
            {
                title: this.appService.translate("wmsStockout.pti_tagcode"),
                code: "pti_tagcode"
            },
            {
                title: this.appService.translate("wmsStockout.poi_code"),
                code: "poi_code"
            },
            {
                title: this.appService.translate("wmsStockout.poi_name"),
                code: "poi_name"
            },
            {
                title: this.appService.translate("wmsStockout.state_name"),
                code: "state_name"
            },
            {
                title: this.appService.translate("wmsStockout.is_in"),
                code: "is_in",
                tpl: 'isOutboundTpl'
            }
        ]
    }
}
