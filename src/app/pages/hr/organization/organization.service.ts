import { Injectable } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { AppService } from "~/shared/services/app.service";
import { RequestService } from "~/shared/services/request.service";
const api = {
    getListAll: '/admin/organizationinfo/getlist',
    add:'/admin/organizationinfo',
    see:'/admin/organizationinfo/',
    update:'/admin/organizationinfo',
    del:'/admin/organizationinfo/delete',
    styleTree:'/admin/StyleClass/getlist',
    setup:'/admin/StyleClassOrganization/getlist'
}
@Injectable({
    providedIn: 'root'
})
export class OrganizationService {

    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService
    ) { }

    getListAll(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.get(api.getListAll, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    add(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.post(api.add, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    see(key) {
        return new Promise((resolve, reject) => {
            this.request.get(api.see + key).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    update(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.put(api.update, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    del(ksys){
        return new Promise((resolve, reject) => {
            this.request.post(api.del, ksys).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    getStyleTree(){
        return new Promise((resolve, reject) => {
            this.request.get(api.styleTree).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    getSetup(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.setup,params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }
}