import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../../../../shared/services/app.service';
import { RequestService } from '../../../../shared/services/request.service';

const api = {
    url: '/admin/operationlog'
}

@Injectable({
    providedIn: 'root'
})
export class OperationLogService {

    constructor(
        private request: RequestService,
        private message: NzMessageService,
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

    get (id) {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get(api.url+ '/' + id).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    del (data) {
        const msgId = this.message.loading(this.appService.translate("dataDeleting"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.post(api.url+ '/delete',data).then(response =>{
                this.message.success(response?.message  || this.appService.translate("sucess.s_delete"))
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    tableColumns(){
        return [
            {
                title: this.appService.translate("sysLogoperation.url"),
                code: "url"
            },
            {
                title: this.appService.translate("sysLogoperation.action"),
                code: "action"
            },
            {
                title: this.appService.translate("sysLogoperation.sui_username"),
                code: "hei_name"
            },
            {
                title: this.appService.translate("sysLogoperation.elapsedtotlalseconds"),
                code: "elapsedtotlalseconds"
            },
            {
                title: this.appService.translate("sysLogoperation.time"),
                code: "time",
                tpl: "timeTpl"
            }
        ]
    }
}
