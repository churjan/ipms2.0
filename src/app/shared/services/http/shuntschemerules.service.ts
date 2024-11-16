import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';
import { RequestService } from '../request.service';
import { UtilService } from '../util.service';

const api = {
    url: '/admin/ShuntSchemeRules',
    showModeurl: '/admin/enum?method=attributelistshowenum',
    optionModeurl:'/admin/enum?method=attributevaluetypeenum'
}

@Injectable({
    providedIn: 'root'
})
export class ShuntSchemeRulesService {

    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService,
        private utilService: UtilService
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
                const images = []
                const videos = []
                if(response.files){
                    response.files.forEach(item =>{
                        switch(item.class){
                            case 1:
                                images.push({
                                    path: item.bfi_path,
                                    originalname: item.bfi_originalname,
                                    key: item.bfi_key,
                                    isDefault: item.isdefault
                                })
                                break
                            case 2:
                                videos.push({
                                    path: item.bfi_path,
                                    originalname: item.bfi_originalname,
                                    key: item.bfi_key,
                                    isDefault: item.isdefault
                                })
                                break
                        }
                    })
                }
                resolve({...response,images: images, videos: videos})
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

    showModeList(){
        return new Promise((resolve,reject) =>{
            this.request.get(api.showModeurl).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            })
        })
    }
    optionModeList(){
        return new Promise((resolve,reject) =>{
            this.request.get(api.optionModeurl).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            })
        })
    }

    tableColumns(){
        return [
            {
                title: this.appService.translate("name"),
                code: "name"
            },
            {
                title: this.appService.translate("field"),
                code: "field"
            },
            {
                title: this.appService.translate("shuntschemerules.optionmode"),
                code: "optionmodedescription"
            },
            {
                title: this.appService.translate("shuntschemerules.showmode"),
                code: "showmodedescription"
            }
        ]
    }
}
