import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';

import { RequestService } from '../request.service';

const api = {
  url: '/admin/softwareclass'
}

@Injectable({
  providedIn: 'root'
})
export class SoftwareCategoryService {

  constructor(private request: RequestService,
    private message: NzMessageService,
    private appService: AppService) { }


  list (params = {}) {
    const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
    return new Promise((resolve,reject) =>{
        this.request.get(api.url+'/getlist',params).then(response =>{
            resolve(response)
        }).catch(error =>{
            reject(error)
        }).finally(() =>{
            this.message.remove(msgId)
        })
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
