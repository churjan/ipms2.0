import { Injectable } from '@angular/core';
import { AppService } from '../../../../shared/services/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../../../../shared/services/request.service';

const api = {
    url: '/admin/Statistics/extend/GetStockStatisticsPageList',
    export: '/public/Statistics/extend/OutExcel/leadingout',
}

@Injectable({
    providedIn: 'root'
})
export class InoutsummaryreportService {

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

    tableColumns(attributes: any[] = [],IsShowDate:boolean,IsShowOnnum:boolean){
        const temp: any[] = []
        attributes.sort((a,b) =>{
            return a.englishname - b.englishname
        }).forEach(item =>{
            temp.push({
                title: item.chinaname,
                code: item.englishname
            })
        })
        if(IsShowOnnum){
        temp.push({
            title: this.appService.translate("Inoutsummaryreport.onnum"),
            code: "onnum",
            width: "160px"
        })
      }
        temp.push({
            title: this.appService.translate("Inoutsummaryreport.innum"),
            code: "innum",
            width: "160px"
        })
        temp.push({
            title: this.appService.translate("Inoutsummaryreport.outnum"),
            code: "outnum",
            width: "160px"
        })
        if(IsShowDate){
            temp.push({
                title: this.appService.translate("date"),
                code: "showdate",
                width: "160px"
            })
        }
        return temp
    }


    export (data) {
        const msgId = this.message.loading(this.appService.translate("placard.fileDownloading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.post(api.export,data,"arraybuffer").then(response =>{
                this.message.success(response?.message  || this.appService.translate("sucess.s_download"))
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }
    
}


