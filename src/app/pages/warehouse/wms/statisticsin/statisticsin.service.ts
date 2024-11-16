import { Injectable } from '@angular/core';
import { AppService } from '../../../../shared/services/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../../../../shared/services/request.service';

const api = {
    url: '/admin/storagespaceinmaster/extend/getstoragespaceinpagelist',
    sync:'/admin/StorageSpaceInMaster/extend/SyncStorageSpaceInReport'
}

@Injectable({
    providedIn: 'root'
})
export class StatisticsinService {

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
                title: this.appService.translate("statisticsIn.carrierid"),
                code: "carrierid"
            },
            {
                title: this.appService.translate("statisticsIn.pti_tagcode"),
                code: "pti_tagcode"
            },
            {
                title: this.appService.translate("statisticsIn.pti_customcode"),
                code: "pti_customcode"
            },
            {
                title: this.appService.translate("statisticsIn.pti_ordercode"),
                code: "pti_ordercode"
            },
            {
                title: this.appService.translate("statisticsIn.lineCode"),
                code: "bls_pname"
            },
            {
                title: this.appService.translate("statisticsIn.bls_name"),
                code: "bls_name"
            },
            {
                title: this.appService.translate("statisticsIn.bls_code"),
                code: "bls_code"
            },
            {
                title: this.appService.translate("statisticsIn.poi_code"),
                code: "poi_code"
            },
            {
                title: this.appService.translate("statisticsIn.poi_name"),
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
            title: this.appService.translate("statisticsIn.indate"),
            code: "indate",
            width: "160px"
        })
        temp.push({
            title: this.appService.translate("statisticsIn.pcr_updatetime"),
            code: "pcr_updatetime",
            width: "160px"
        })

        return temp
    }
    
}
