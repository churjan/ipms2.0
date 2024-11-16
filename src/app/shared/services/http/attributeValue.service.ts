import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';
import { RequestService } from '../request.service';
import { UtilService } from '../util.service';

const api = {
    url: '/admin/customattributedetail',
    downloadTpl: '/admin/customattributedetail/excel',
    import: "/admin/customattributedetail/import"
}

@Injectable({
    providedIn: 'root'
})
export class AttributeValueService {

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

    downloadTpl () {
        const msgId = this.message.loading(this.appService.translate("fileDownloading"), { nzDuration: 0 }).messageId
        this.request.get(api.downloadTpl,{},"arraybuffer").then(response =>{
            this.message.success(response?.message  || this.appService.translate("downloadSuccess"))
            const blob = new Blob([response],{type:"application/vnd.ms-excel;charset=utf-8"})
            this.utilService.downloadBlob(blob,'attributeValue.xlsx')
        }).finally(() =>{
            this.message.remove(msgId)
        })
    }

    import (data: any,key: string) {
        const msgId = this.message.loading(this.appService.translate("dataImporting"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.post(api.import+'/'+key,data).then(response =>{
                this.message.success(response?.message  || this.appService.translate("importSuccess"))
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
                title: this.appService.translate("name"),
                code: "name"
            },
            {
                title: this.appService.translate("code"),
                code: "value"
            }
        ]
    }
}
