import { Injectable } from '@angular/core';
import { RequestService } from '../../../shared/services/request.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../../../shared/services/app.service';

const api = {
    url: '/admin/roleinfo',
    permissions: '/admin/system/extend/allmenu'
}

@Injectable({
    providedIn: 'root'
})
export class RoleService {

    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService
        ) { }

    getPermissions () {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get(api.permissions).then(response =>{
                resolve({
                    permissions: this.buildPermissionSelecteTree(response),
                    original: response
                })
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    all () {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get(api.url+'/getlist').then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    list (params) {
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
                const permissions = this.getSelectedKeys(response.menus)
                resolve({...response,permissions: permissions})
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

    buildPermissionSelecteTree(data){
        const result = []
        data.forEach(item => {
            const temp = {
                title: item.name,
                value: item.key,
                key: item.key,
                children: [],
                isLeaf: false
            }
            if(item.sonlist?.length > 0){
                temp.children = this.buildPermissionSelecteTree(item.sonlist)
            }
            if(item.menubuttondtolist?.length > 0){
                const children = this.buildPermissionSelecteTree(item.menubuttondtolist)
                children.forEach(ite =>{
                    temp.children.push(ite)
                })
            }
            if(temp.children?.length <= 0){
                temp.isLeaf = true
            }
            result.push(temp)
        })
        return result
    }

    getSelectedKeys(data){
        let result = []
        data.forEach(item =>{
            if(item.ischecked){
                result.push(item.key)
            }
            if(item.sonlist?.length > 0){
                const res = this.getSelectedKeys(item.sonlist)
                result = result.concat(res)
            }
            if(item.menubuttondtolist?.length > 0){
                const res = this.getSelectedKeys(item.menubuttondtolist)
                result = result.concat(res)
            }
        })
        return result
    }

    static selectLower(selectedPermissions :string[], checked: boolean, children: any[]){
        if(checked){
            if(children instanceof Array){
                children.forEach(item =>{
                    if(!selectedPermissions.includes(item.key)){
                        selectedPermissions.push(item.key)
                    }
                    if(item.children){
                        RoleService.selectLower(selectedPermissions,true,item.children)
                    }
                })
            }
        }else{
            if(children instanceof Array){
                children.forEach(item =>{
                    const index = selectedPermissions.indexOf(item.key)
                    if(index >= 0){
                        selectedPermissions.splice(index,1)
                    }
                    if(item.children){
                        RoleService.selectLower(selectedPermissions,false,item.children)
                    }
                })
            }
        }
    }

    static selectUpper(selectedPermissions :string[], node: any){
        if(node.parentNode){
            if(!selectedPermissions.includes(node.parentNode.key)){
                selectedPermissions.push(node.parentNode.key)
            }
            if(node.parentNode.parentNode){
                RoleService.selectUpper(selectedPermissions, node.parentNode)
            }
        }
    }

    static setChecked(data: any[], keys: any[]){
        data.forEach(item =>{
            if(keys.includes(item.key)){
                item.ischecked = true
            }
            if(item.sonlist?.length > 0){
                RoleService.setChecked(item.sonlist,keys)
            }
            else if(item.menubuttondtolist?.length > 0){
                RoleService.setChecked(item.menubuttondtolist,keys)
            }
        })
    }

    /* getAllDownBySelected(data,ids,result = []){
        data.forEach(item =>{
            if(ids.includes(item.value)){
                result.push(item.value)
                if(item.children?.length > 0){
                    this.getAllDownBySelected(item.children,item.children.map(ite =>{return ite.value}),result)
                }
            }else{
                if(item.children?.length > 0){
                    this.getAllDownBySelected(item.children,ids,result)
                }
            }
        })
        return result
    } */


    tableColumns(){
        return [
            {
                title: this.appService.translate("name"),
                code: "name"
            },
            {
                title: this.appService.translate("description"),
                code: "description"
            }
        ]
    }
}
