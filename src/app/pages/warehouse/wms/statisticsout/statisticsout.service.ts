import { Injectable } from '@angular/core';
import { AppService } from '../../../../shared/services/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../../../../shared/services/request.service';

const api = {
    url: '/admin/w_WarehouseOutMaster/extend/getstoragespaceoutpagelist',
    sync:'/admin/w_WarehouseOutMaster/extend/SyncStorageSpaceOutReport'
}

@Injectable({
    providedIn: 'root'
})
export class StatisticsoutService {

    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService
        ) { }

    list (data = {}) {
        return new Promise((resolve,reject) =>{
            this.request.post(api.url,data).then(response =>{
                response.data.forEach(item =>{
                    if(item.tagattributelist){
                        item.tagattributelist.forEach(subitem =>{
                            item[subitem.pca_englishname] = subitem.pcad_name
                        })
                    }
                })
                resolve(response)
            }).catch(error =>{
                reject(error)
            })
        })
    }
    
    sync (data) {
        const msgId = this.message.loading(this.appService.translate("placard.dataSyncing"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.post(api.sync,data).then(response =>{
                this.message.success(response?.message  || this.appService.translate("sucess.s_syn"))
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    tableColumns(attributes: any[] = []){
        const temp: any[] = [
            {
                title: this.appService.translate("carrierId"),
                code: "carrierid"
            },
            {
                title: this.appService.translate("tagCode"),
                code: "pti_tagcode"
            },
            {
                title: this.appService.translate("statisticsOut.labelCustomNo"),
                code: "pti_customcode",
            },
            {
                title: this.appService.translate("orderNo"),
                code: "pti_ordercode"
            },
            {
                title: this.appService.translate("lineName"),
                code: "bls_pname"
            },
            {
                title: this.appService.translate("blsName"),
                code: "bls_name"
            },
            {
                title: this.appService.translate("blsCode"),
                code: "bls_code"
            },
            {
                title: this.appService.translate("procedureCode"),
                code: "poi_code"
            },
            {
                title: this.appService.translate("procedureName"),
                code: "poi_name"
            },
        ]

        attributes.sort((a,b) =>{
            return a.sort - b.sort
        }).forEach(item =>{
            temp.push({
                title: item.chinaname,
                code: item.englishname
            })
        })

        temp.push({
            title: this.appService.translate("statisticsOut.carrierOutTime"),
            code: "outdate",
            width: "160px"
        })
        temp.push({
            title: this.appService.translate("statisticsOut.carrierUpdateTime"),
            code: "pcr_updatetime",
            width: "160px"
        })

        return temp
    }
}
