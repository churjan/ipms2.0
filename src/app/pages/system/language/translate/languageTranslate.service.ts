import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../../../../shared/services/app.service';

import { RequestService } from '../../../../shared/services/request.service';

const api = {
    url: "/admin/LanguageOriginalText",
    translate: "/admin/LanguageTranslateText",
    export: "/public/LanguageOriginalText/leadingout",
    import: "/admin/LanguageOriginalText/imp"
}

@Injectable({
    providedIn: 'root'
})
export class LanguageTranslateService {

    constructor(private request: RequestService,
        private message: NzMessageService,
        private appService: AppService) { }


    list (params = {}) {
        return new Promise((resolve,reject) =>{
            this.request.get(api.url,params).then(({total,data}) =>{
                const list = data.data.map(item => {
                    item.slt_list.forEach(ite =>{
                        item[ite.slv_language] = ite.translatetext
                        item[ite.slv_language+'_key'] = ite.key
                    })
                    delete item.slt_list
                    return item
                })
                resolve({title: data.title, total, data: list})
            }).catch(error =>{
                reject(error)
            })
        })
    }

    translate (data) {
        const msgId = this.message.loading(this.appService.translate("placard.dataSaving"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.post(api.translate,data).then(response =>{
                this.message.success(response?.message  || this.appService.translate("sucess.s_save"))
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    export (data) {
        const msgId = this.message.loading(this.appService.translate("fileDownloading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get(api.export,data,"arraybuffer").then(response =>{
                this.message.success(response?.message  || this.appService.translate("downloadSuccess"))
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    import (data,language) {
        const msgId = this.message.loading(this.appService.translate("dataImporting"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.post(api.import+'/'+language,data).then(response =>{
                this.message.success(response?.message  || this.appService.translate("importSuccess"))
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

    tableColumns(columns){
        const temp: any = [
            {
                title:  "简体中文",
                code: "originaltext"
            }
        ]

        columns.forEach(item =>{
            temp.push({
                title:  item.name,
                code: item.flag,
                headTpl: "titleTpl",
                tpl: "valueTpl"
            })
        })

        return temp
    }
}
