import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../../../../shared/services/app.service';
import { RequestService } from '../../../../shared/services/request.service';

const api = {
    url: '/admin/storagespaceouttimer',
    status: '/admin/storagespaceouttimer/extend/changestatus',
    schemes: '/admin/w_WarehouseOutRelation/getlist'
}

@Injectable({
    providedIn: 'root'
})
export class AutoOutControlService {

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
                    outtime: response.outtime || null,
                    details: []
                }
                if (response.details) {
                    result.details = response.details.map(({ ssor_key }) => ssor_key)
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

    changeStatus(data) {
        const msgId = this.message.loading(this.appService.translate("placard.dataActioning"), { nzDuration: 0 }).messageId
        return new Promise((resolve, reject) => {
            this.request.post(api.status, data).then(response => {
                this.message.success(response?.message || this.appService.translate("sucess.s_action"))
                resolve(response)
            }).catch(error => {
                reject(error)
            }).finally(() => {
                this.message.remove(msgId)
            })
        })
    }

    schemes() {
        return new Promise((resolve, reject) => {
            this.request.get(api.schemes).then(response => {
                const result = response.map(({ key, name }) => {
                    return {
                        title: name,
                        value: key
                    }
                })
                resolve(result)
            }).catch(error => {
                reject(error)
            })
        })
    }

    tableColumns() {
        return [
            {
                title: this.appService.translate("autoOutControl.name"),
                code: "name",
            },
            {
                title: this.appService.translate("autoOutControl.statusname"),
                code: "statusname",
            },
            {
                title: this.appService.translate("autoOutControl.statusname") + '/' + this.appService.translate("btn.operation"),
                code: "statusname",
                width: "160px",
                headTpl: "statusHeadTpl",
                tpl: "statusTpl"
            },
            {
                title: this.appService.translate("autoOutControl.outtime"),
                code: "outtime",
                width: "160px",
                tpl: "timeTpl"
            }
        ]
    }
}
