import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';
import { RequestService } from '../request.service';

const api = {
    url: '/admin/w_WarehouseOutControl',
    detail: '/admin/w_WarehouseOutTask/extend/getoutmasterforcontroldetail'
}

@Injectable({
    providedIn: 'root'
})
export class OutControlService {

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

    all () {
        return new Promise((resolve,reject) =>{
            this.request.get(api.url+'/getlist').then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            })
        })
    }


    get (id) {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get(api.url+ '/' + id).then((response: any) =>{
                const result = {
                    name: response.name || null,
                    status: response.status || null,
                    poi_key: response.poi_key || null,
                    stations: response.routes || []
                }
                resolve(result)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    add (data) {
        const msgId = this.message.loading(this.appService.translate("dataSaving"), { nzDuration: 0 }).messageId
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
        const msgId = this.message.loading(this.appService.translate("dataSaving"), { nzDuration: 0 }).messageId
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

    detail (data) {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.post(api.detail,data).then(response =>{
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
                title: this.appService.translate("status"),
                code: "statusname"
            },
            {
                title: this.appService.translate("procedureName"),
                code: "poi_name"
            },
            {
                title: this.appService.translate("procedureCode"),
                code: "poi_code"
            },
            {
                title: this.appService.translate("createTime"),
                code: "create_time",
                width: "160px",
                tpl: "timeTpl"
            }
        ]
    }

    detailTableColumns(){
        return [
            {
                title: this.appService.translate("carrierId"),
                code: "carrierid",
                headTpl: 'filterTpl'
            },
            {
                title: this.appService.translate("blsName"),
                code: "bls_name",
                headTpl: 'filterTpl'
            },
            {
                title: this.appService.translate("blsCode"),
                code: "bls_code",
                headTpl: 'filterTpl'
            },
            {
                title: this.appService.translate("wmsStockout.portName"),
                code: "out_bls_name",
                headTpl: 'filterTpl'
            },
            
            {
                title: this.appService.translate("wmsStockout.portCode"),
                code: "out_bls_code",
                headTpl: 'filterTpl'
            },
            {
                title: this.appService.translate("tagCode"),
                code: "pti_tagcode",
                headTpl: 'filterTpl'
            },
            {
                title: this.appService.translate("status"),
                code: "state_name",
                headTpl: 'filterTpl'
            },
            {
                title: this.appService.translate("createTime"),
                code: "createtime",
                headTpl: 'filterTpl',
                tpl: "timeTpl"
            }
        ]
    }
}
