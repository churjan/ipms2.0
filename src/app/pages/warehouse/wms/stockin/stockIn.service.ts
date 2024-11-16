import { Injectable } from '@angular/core';
import { AppService } from '../../../../shared/services/app.service';
import { RequestService } from '../../../../shared/services/request.service';

const api = {
  url: '/admin/w_WarehouseInMaster',
  detail: "/admin/w_WarehouseInDetail"
}

@Injectable({
  providedIn: 'root'
})
export class StockInService {

    constructor(
        private request: RequestService,
        private appService: AppService
        ) { }


    list (params = {}) {
        return new Promise((resolve,reject) =>{
            this.request.get(api.url,params).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            })
        })
    }

    detail (params = {}) {
        return new Promise((resolve,reject) =>{
            this.request.get(api.detail,params).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            })
        })
    }

    tableColumns(){
        return [
            {
                title: this.appService.translate("wmsStockin.code"),
                code: "code"
            },
            {
                title: this.appService.translate("wmsStockin.state_name"),
                code: "statenmae"
            },
            {
                title: this.appService.translate("wmsStockin.createtime"),
                code: "createtime",
                width: "160px",
                tpl: "timeTpl"
            }
        ]
    }

    detailTableColumns(){
        return [
            {
                title: this.appService.translate("wmsStockin.bls_name"),
                code: "bls_name"
            },
            {
                title: this.appService.translate("wmsStockin.bls_code"),
                code: "bls_code"
            },
            {
                title: this.appService.translate("wmsStockin.type_name"),
                code: "type_name"
            },
            {
                title: this.appService.translate("wmsStockin.carrierid"),
                code: "carrierid"
            },
            {
                title: this.appService.translate("wmsStockin.pti_tagcode"),
                code: "pti_tagcode"
            },
            {
                title: this.appService.translate("wmsStockin.poi_code"),
                code: "poi_code"
            },
            {
                title: this.appService.translate("wmsStockin.poi_name"),
                code: "poi_name"
            },
            {
                title: this.appService.translate("wmsStockin.state_name"),
                width: "90px",
                code: "state_name"
            },
            {
                title: this.appService.translate("wmsStockin.remark"),
                code: "remark"
            },
            {
                title: this.appService.translate("wmsStockin.indate"),
                code: "indate",
                width: "160px",
                tpl: "timeTpl"
            },
        ]
    }
}
