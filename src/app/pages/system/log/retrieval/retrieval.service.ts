import { environment } from "@/environments/environment";
import { Injectable } from "@angular/core";
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from "~/shared/services/app.service";
import { RequestService } from "~/shared/services/request.service";

const api = {
    queryUrl: environment.rootUrl+'/to/api/admin/LogsTracking'
}

@Injectable({
    providedIn: 'root'
})
export class RetrievalService {
    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService
    ) { }

    query(params){
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId;
        return new Promise((resolve,reject) =>{
            this.request.get(api.queryUrl,params).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }
}