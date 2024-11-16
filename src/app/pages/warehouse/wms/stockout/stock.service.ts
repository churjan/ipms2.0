import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../../../shared/services/app.service';
import { RequestService } from '../../../shared/services/request.service';

const api = {
    url: '/admin/w_WarehouseInventory/extend/getstoragespaceinventorypagelist',
    stations: '/admin/layoutstructure/extend/gettreeforstoragespacelist',
    save: '/admin/w_WarehouseOutMaster',
    clatimeurl: '/admin/w_WarehouseInventory/extend/GetStorageSpaceInventoryTime',
}

@Injectable({
    providedIn: 'root'
})
export class StockService {

    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService
        ) { }


    list (data = {}) {
        return new Promise((resolve,reject) =>{
            this.request.post(api.url,data).then(response =>{
                response.data.forEach(item =>{
                    if(item.tagattributelist){
                        item.tagattributelist.forEach(subitem =>{
                            item[subitem.pca_englishname] = subitem.pcad_name
                        })
                    }
                })
                resolve(response)
            }).catch(error =>{
                reject(error)
            })
        })
    }

    save (data) {
        const msgId = this.message.loading(this.appService.translate("placard.dataSaving"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.post(api.save,data).then(response =>{
                this.message.success(response?.message  || this.appService.translate("sucess.s_save"))
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    stations(){
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get(api.stations).then(response =>{
                resolve(this.reBuildData(response))
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    reBuildData(data){
        if(!data || data.length <= 0) return []
        return data.map(item =>{
            const temp = {
                key: item.key,
                pkey: item.pkey,
                name: item.name,
                path: item.path,
                children: []
            }
            if(item.sonlist 
                && item.sonlist.length > 0){
                temp.children = this.reBuildData(item.sonlist)
            }
            return temp
        })
    }
    clatimeurl(data){
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.post(api.clatimeurl,data).then(response =>{
                this.message.success(response?.message  || this.appService.translate("placard.dataLoading"))
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    tableColumns(attributes: any[] = []){
        const temp = [
            {
                title: this.appService.translate("lineName"),
                code: "bls_pname"
            },
            {
                title: this.appService.translate("blsName"),
                code: "bls_name",
            },
            {
                title: this.appService.translate("orderNo"),
                code: "pti_ordercode",
            },
            {
                title: this.appService.translate("tagCode"),
                code: "pti_tagcode",
                width: "160px"
            },
            {
                title: this.appService.translate("carrierId"),
                code: "carrierid",
                width: "160px"
            },
            {
                title: this.appService.translate("isFrozen"),
                code: "isfrozen",
                width: "80px",
                tpl: "statusTpl"
            },
            {
                title: this.appService.translate("stock.stockInTime"),
                code: "create_time",
                width: "160px",
                tpl: "timeTpl"
            }
        ]

        attributes.sort((a,b) =>{
            return a.sort - b.sort
        }).forEach(item =>{
            temp.push({
                title: item.chinaname,
                code: item.englishname
            })
        })

        return temp
    }

    outTableColumns(){
        return [
            {
                title: this.appService.translate("lineName"),
                code: "bls_pname"
            },
            {
                title: this.appService.translate("blsName"),
                code: "bls_name",
            },
            {
                title: this.appService.translate("blsCode"),
                code: "bls_code",
            },
            {
                title: this.appService.translate("orderNo"),
                code: "pti_ordercode",
            },
            {
                title: this.appService.translate("tagCode"),
                code: "pti_tagcode",
                width: "160px"
            },
            {
                title: this.appService.translate("carrierId"),
                code: "carrierid",
                width: "160px"
            },
            {
                title: this.appService.translate("stock.outPort"),
                code: "out_bls_key",
                fixed: "right",
                tpl: "outPortTpl",
                width: "300px"
            }
        ]
    }
}
