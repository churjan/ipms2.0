import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../../../../shared/services/app.service';
import { RequestService } from '../../../../shared/services/request.service';

const api = {
    url: '/admin/w_WarehouseOutControl',
    detail: '/admin/w_WarehouseOutTask/extend/GetOutMasterForTask'
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


    list(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.get(api.url, params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    all() {
        return new Promise((resolve, reject) => {
            this.request.get(api.url + '/getlist').then(response => {
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
                    state: response.state || null,
                    poi_key: response.poi_key || null,
                    routes: response.routes || [],
                    over_poi_keys: response.over_poi_keys || [],
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

    detail(data) {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve, reject) => {
            this.request.post(api.detail, data).then(response => {
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
                title: this.appService.translate("wmsOutcontrol.name"),
                code: "name"
            },
            {
                title: this.appService.translate("wmsOutcontrol.state_name"),
                code: "state_name"
            },
            {
                title: this.appService.translate("wmsOutcontrol.poi_name"),
                code: "poi_name"
            },
            {
                title: this.appService.translate("wmsOutcontrol.poi_code"),
                code: "poi_code"
            },
            {
                title: this.appService.translate("wmsOutcontrol.createtime"),
                code: "createtime",
                width: "160px",
                tpl: "timeTpl"
            }
        ]
    }

    detailTableColumns() {
        return [
            {
                title: this.appService.translate("wmsStockout.carrierid"),
                code: "carrierid",
                headTpl: 'filterTpl'
            },
            {
                title: this.appService.translate("wmsStockout.bls_name"),
                code: "bls_name",
                headTpl: 'filterTpl'
            },
            {
                title: this.appService.translate("wmsStockout.bls_code"),
                code: "bls_code",
                headTpl: 'filterTpl'
            },
            {
                title: this.appService.translate("wmsStockout.out_bls_name"),
                code: "out_bls_name",
                headTpl: 'filterTpl'
            },

            {
                title: this.appService.translate("wmsStockout.out_bls_code"),
                code: "out_bls_code",
                headTpl: 'filterTpl'
            },
            {
                title: this.appService.translate("wmsStockout.pti_tagcode"),
                code: "pti_tagcode",
                headTpl: 'filterTpl'
            },
            {
                title: this.appService.translate("wmsStockout.state_name"),
                code: "state_name",
                headTpl: 'filterTpl'
            },
            {
                title: this.appService.translate("wmsStockout.createtime"),
                code: "createtime",
                headTpl: 'filterTpl',
                tpl: "timeTpl"
            },
            {
                title: this.appService.translate("wmsStockout.is_in"),
                code: "is_in",
                headTpl: 'filterTpl',
                tpl: "isOutboundTpl"
            }
        ]
    }
}
