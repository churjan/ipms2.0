import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';
import { RequestService } from '../request.service';

const api = {
    url: '/admin/organizationinfo'
}

@Injectable({
    providedIn: 'root'
})
export class OrganizationService {

    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService
        ) { }

    get (id) {
        return new Promise((resolve,reject) =>{
            this.request.get(api.url+ '/' + id).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            })
        })
    }

    list (params = {}) {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get(api.url+'/getlist',params).then(response =>{
                const result = this.reBuildData(response)
                resolve(result)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    reBuildData(data){
        if(!data || data.length <= 0) return []
        return data.map(item =>{
            const temp = {
                key: item.key,
                pkey: item.pkey,
                name: item.name,
                children: []
            }
            if(item.sonlist 
                && item.sonlist.length > 0){
                temp.children = this.reBuildData(item.sonlist)
            }
            return temp
        })
    }

    add (data) {
        const msgId = this.message.loading(this.appService.translate("placard.dataSaving"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.post(api.url,data).then(response =>{
                this.message.success(response?.message  || this.appService.translate("sucess.s_save"))
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    update (data,id) {
        data.key = id
        const msgId = this.message.loading(this.appService.translate("placard.dataSaving"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.post(api.url,data).then(response =>{
                this.message.success(response?.message  || this.appService.translate("sucess.s_save"))
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    del (id) {
        const msgId = this.message.loading(this.appService.translate("dataDeleting"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.post(api.url+ '/delete',[{key: id}]).then(response =>{
                this.message.success(response?.message  || this.appService.translate("sucess.s_delete"))
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }
}
