import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../../../../shared/services/app.service';
import { RequestService } from '../../../../shared/services/request.service';

const api = {
    url: '/admin/w_WarehouseOutTask'
}

@Injectable({
    providedIn: 'root'
})
export class OutControlTaskService {

    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService,
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
                const { ssot_name, ssot_quantity, ssot_ssor_key, routes, ssot_key, ssot_ordercode, ssot_pickingordercode, ssot_whincode, ssot_whoutcode  } = response
                resolve({
                    form:{
                        name: ssot_name || null,
                        quantity: ssot_quantity || 0,
                        ssor_key: ssot_ssor_key || null,
                        ordercode: ssot_ordercode || null,
                        pickingordercode: ssot_pickingordercode || null,
                        whincode: ssot_whincode || null,
                        whoutcode: ssot_whoutcode || null,
                    },
                    ssot_key: ssot_key,
                    station: routes
                })
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    getModel (id) {
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

    add (data) {
        const msgId = this.message.loading(this.appService.translate("placard.dataSaving"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.post(api.url,data).then(response =>{
                this.message.success(response?.message || this.appService.translate("sucess.s_save"))
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
                this.message.success(response?.message || this.appService.translate("sucess.s_save"))
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

    changeStatus (data) {
        const msgId = this.message.loading(this.appService.translate("dataActioning"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.post(api.url+"/extend/changestatus",data).then(response =>{
                this.message.success(response?.message  || this.appService.translate("sucess.s_action"))
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    fetchCustomFields() {
        return new Promise((resolve, reject) => {
          this.request
            .get('/admin/LayoutStructureRules/getlist?Module=5')
            .then((response) => {
              resolve(response);
            })
            .catch((error) => {
              reject(error);
            });
        });
      }

    tableColumns(){
        return [
            {
                title: this.appService.translate("wmsOutcontrol.name"),
                code: "name",
                ellipsis:true,
                width: "160px"
            },
            {
                title: this.appService.translate("wmsOutcontrol.code"),
                code: "code",
                width: "160px"
            },
            {
                title: this.appService.translate("wmsOutcontrol.outControl"),
                code: "control_name"
            },
            {
                title: this.appService.translate("wmsOutcontrol.wwor_name"),
                code: "wwor_name",
                ellipsis:true,
                width: "160px"
            },
            {
                title: this.appService.translate("wmsOutcontrol.state_name"),
                code: "state_name",
                tpl: 'stateTpl'
            },
            {
                title: this.appService.translate("wmsOutcontrol.quantity"),
                code: "quantity",
                tpl: "numTpl",
            },
            {
                title: this.appService.translate("wmsOuttask.type_name"),
                code: "type_name",
            },
            {
                title: this.appService.translate("wmsOuttask.condition_names"),
                width: "200px",
                ellipsis:true,
                code: "condition_names",
            },
            {
                title: this.appService.translate("wmsOutcontrol.createtime"),
                code: "createtime",
                tpl: "timeTpl",
                width: "160px"
            }
        ]
    }
}
