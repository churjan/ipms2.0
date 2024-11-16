import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';
import { AppService } from '../app.service';
import { RequestService } from '../request.service';

const api = {
    enum: '/admin/enum',
    upload: '/filesinfo',
    dictionary: '/admin/classdata/getlist',
    hangerQuery: '/public/carrier/Search',
    systemParameter: '/admin/systemparameters/extend/getsystemparameter',
    attributes: '/admin/customattribute/getlist',
    attribute_rule: '/admin/CustomAttribute/extend/GetAttributeListByType',
    structures: '/admin/w_LayoutStructure/getlist',
    flows: '/admin/operationprocessmaster/getlist',
    groups: '/admin/groupinfo/getlist',
    tableHeader: '/admin/w_WarehouseInventory/extend/getattributelist',
    packStations: '/admin/layoutstructure/extend/packstations',
    procedures: '/admin/operationinfo/getlist',
    skuIn: '/external/report/getstoragespaceinreport',
    skuOut: '/external/report/getstoragespaceoutreport',
    getNextOperationRouteList: '/admin/OperationProcessMaster/extend/GetNextOperationRouteList',
}

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    fallBack = 'data:image/png;base64,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'
    baseUrl = environment.baseUrl.replace("api","")

    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService
    ) {
        /* if(environment.isGangDai){
            api.hangerQuery = "/public/carriersample/search"
        } */
     }


    enum (code) {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get(api.enum,{ method: code }).then(response =>{
                const result = response.map(({name,value,description,category}) =>{
                    return {
                        name: name,
                        value: value,
                        description:description,
                        category:category
                    }
                })
                resolve(result)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }


    upload (data) {
        const msgId = this.message.loading(this.appService.translate("dataUploading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.upload(api.upload,data).then(response =>{
                this.message.success(response?.message  || this.appService.translate("uploadSuccess"))
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    dictionary (code) {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get(api.dictionary,{ pcode: code }).then(response =>{
                const result = response instanceof Array ? response : []
                resolve(result)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    hangerQuery (keyword) {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get(api.hangerQuery,{ keywords: keyword }).then(response =>{
                if(response.tags instanceof Array){
                    response.tags.forEach(item =>{
                        item.tagattrs.sort((a,b) =>{
                            return a.sort - b.sort
                        })
                    })
                }
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    systemParameter(code){
        return new Promise((resolve,reject) =>{
            this.request.post(api.systemParameter,{ code: code }).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            })
        })
    }

    attributes (params = {},type='attribute') {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get(type=='attribute'?api.attributes:api.attribute_rule,params).then(response =>{
                const valueOptions: any = {}
                const fieldOptions: Array<any> = []
                if(response){
                    response.forEach(item =>{
                        valueOptions[item.key] = item.customattributedetaillist.map(ite =>{
                            return {
                                name: ite.name,
                                key: ite.value
                            }
                        })
                    })
                    response.forEach(item => {
                        fieldOptions.push({
                            name: item.chinaname,
                            code: item.englishname,
                            key: item.key,
                            optionmode:item.optionmode
                        })
                    })
                }
                resolve({
                    fieldOptions: fieldOptions,
                    valueOptions: valueOptions
                })
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    structures(params){
        // const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get(api.structures,params).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                // this.message.remove(msgId)
            })
        })
    }

    flows () {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get(api.flows).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    groups () {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get(api.groups).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    getTableHeader () {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get(api.tableHeader).then(response =>{
                let result = []
                if(response){
                    result = response.sort((a,b) =>{return a.sort - b.sort})
                }
                resolve(result)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    packStations(params = {}){
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get(api.packStations, params).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    procedures(){
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get(api.procedures).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    sku(data: any, type: string = 'in'){
        const url  = type == 'in' ? api.skuIn : api.skuOut
        return new Promise((resolve,reject) =>{
            this.request.post(url,data).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            })
        })
    }

    getNextOperationRouteList(poi_key:string)  //传入当前工序
    {
        return new Promise((resolve,reject) =>{
            this.request.post(api.getNextOperationRouteList,{"poi_key":poi_key}).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            })
        })
    }

    selectList (url: string){
        return new Promise((resolve,reject) =>{
            this.request.get(`${url}`).then((response) =>{
                resolve(response)
            }).catch((error) =>{
                reject(error)
            })
        })
      }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
          /[xy]/g,
          function (c) {
            var r = (Math.random() * 16) | 0,
              v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          }
        );
    }
}
