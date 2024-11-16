import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '~/shared/services/app.service';
import { RequestService } from '~/shared/services/request.service';
const api = {
  url: '/admin/customattributebindquantity',
  complete: '/admin/order/extend/complete'
}
@Injectable({
    providedIn: 'root',
})
export class AttributebindquantityService {
    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService,
    ) {}
    fetchList(url='',params = {}) {
        return new Promise((resolve, reject) => {
            this.request
                .get(url, params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    list(params = {}) {
        return new Promise((resolve, reject) => {
            this.request
                .get(api.url, params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    get (id) {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get(api.url+ '/' + id).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    add(data) {
        const msgId = this.message.loading(
            this.appService.translate('dataSaving'),
            { nzDuration: 0 }
        ).messageId;
        return new Promise((resolve, reject) => {
            this.request
                .post(api.url, data)
                .then((response) => {
                    this.message.success(
                        response?.message ||
                            this.appService.translate('saveSuccess')
                    );
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                })
                .finally(() => {
                    this.message.remove(msgId);
                });
        });
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

    tableColumns() {
        return [
            {
                title: this.appService.translate('attributebindquantity.pca_englishname'),
                code: 'pca_englishname',
            },
            {
                title: this.appService.translate('attributebindquantity.pcad_value'),
                code: 'pcad_value',
            },
            {
                title: this.appService.translate('attributebindquantity.quantity'),
                code: 'quantity',
            },
            {
                title: this.appService.translate('attributebindquantity.create_time'),
                code: 'create_time',
                tpl: 'timeTpl',
            },
        ];
    }
}
