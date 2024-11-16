import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../../../shared/services/app.service';
import { RequestService } from '../../../shared/services/request.service';

const api = {
    url: '/admin/filesinfo'
}

@Injectable({
    providedIn: 'root'
})
export class FileService {

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
                title: this.appService.translate("file.name"),
                code: "originalname"
            },
            {
                title: this.appService.translate("file.path"),
                code: "path",
                tpl: "pathTpl"
            },
            {
                title: this.appService.translate("file.size"),
                code: "size",
                width: "150px",
                tpl: "sizeTpl"
            },
            {
                title: this.appService.translate("createTime"),
                code: "create_time",
                width: "160px",
                tpl: "timeTpl"
            }
        ]
    }
}
