import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../../../shared/services/app.service';

import { RequestService } from '../../../shared/services/request.service';

const api = {
    url: '/admin/systemparameters'
}

@Injectable({
    providedIn: 'root'
})
export class ParameterService {

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
            this.request.get(api.url + '/' + id).then((result) => {
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
        const msgId = this.message.loading(this.appService.translate("dataDeleting"), { nzDuration: 0 }).messageId
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
                title: this.appService.translate("sysParameters.name"),
                code: "name"
            },
            {
                title: this.appService.translate("sysParameters.code"),
                code: "code"
            },
            {
                title: this.appService.translate("sysParameters.type"),
                code: "typename"
            },
            {
                title: this.appService.translate("sysParameters.value"),
                code: "value",
                width: '200px',
                ellipsis: true
            }
        ]
    }
}
