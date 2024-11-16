import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../../../../shared/services/app.service';
import { RequestService } from '../../../../shared/services/request.service';

const api = {
    url: '/admin/w_WarehouseOutRelation',
}

@Injectable({
    providedIn: 'root'
})
export class AutoOutSchemeService {

    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService
    ) { }


    list(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.get(api.url, params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    get(id) {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve, reject) => {
            this.request.get(api.url + '/' + id).then((response: any) => {
                const result = {
                    name: response.name || null,
                    description: response.description || null,
                    isbox: response.isbox || null,
                    box_number: response.box_number || null,
                    conditions: response.conditions || [],
                    stations: response.routes || []
                }
                resolve(result)
            }).catch(error => {
                reject(error)
            }).finally(() => {
                this.message.remove(msgId)
            })
        })
    }

    add(data) {
        const msgId = this.message.loading(this.appService.translate("placard.dataSaving"), { nzDuration: 0 }).messageId
        return new Promise((resolve, reject) => {
            this.request.post(api.url, data).then(response => {
                this.message.success(response?.message || this.appService.translate("sucess.s_save"))
                resolve(response)
            }).catch(error => {
                reject(error)
            }).finally(() => {
                this.message.remove(msgId)
            })
        })
    }

    update(data, id) {
        data.key = id
        const msgId = this.message.loading(this.appService.translate("placard.dataSaving"), { nzDuration: 0 }).messageId
        return new Promise((resolve, reject) => {
            this.request.post(api.url, data).then(response => {
                this.message.success(response?.message || this.appService.translate("sucess.s_save"))
                resolve(response)
            }).catch(error => {
                reject(error)
            }).finally(() => {
                this.message.remove(msgId)
            })
        })
    }

    del(data) {
        const msgId = this.message.loading(this.appService.translate("placard.dataDeleting"), { nzDuration: 0 }).messageId
        return new Promise((resolve, reject) => {
            this.request.post(api.url + '/delete', data).then(response => {
                this.message.success(response?.message || this.appService.translate("sucess.s_delete"))
                resolve(response)
            }).catch(error => {
                reject(error)
            }).finally(() => {
                this.message.remove(msgId)
            })
        })
    }

    tableColumns() {
        return [
            {
                title: this.appService.translate("wmsAutooutscheme.name"),
                code: "name"
            },
            {
                title: this.appService.translate("wmsAutooutscheme.description"),
                code: "description"
            },
            {
                title: this.appService.translate("wmsAutooutscheme.createtime"),
                code: "createtime",
                width: "160px",
                tpl: "timeTpl"
            }
        ]
    }
}
