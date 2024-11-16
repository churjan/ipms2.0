import { environment } from '@/environments/environment';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from '~/global';
import { AppService } from '../../../shared/services/app.service';

import { RequestService } from '../../../shared/services/request.service';

const api = {
    treeAdd: '/admin/softwareclass',
    treeUpdate: '/admin/softwareclass',
    treeDel: '/admin/SoftwareClass/delete',
    treeSee: '/admin/SoftwareClass/',
    getList: '/admin/softwareupdate',
    upFile: '/FilesInfo',
    add: '/admin/SoftwareUpdate',
    see: '/admin/SoftwareUpdate/',
    del: '/admin/SoftwareUpdate/delete'
}

@Injectable({
    providedIn: 'root'
})
export class SoftwareService {

    constructor(private request: RequestService,
        private message: NzMessageService,
        private appService: AppService,
        private global: GlobalService
    ) { }

    getUpFileUrl(){
        return environment.baseUrl+api.upFile;
    }

    treeAdd(params = {}){
        return new Promise((resolve, reject) => {
            this.request.post(api.treeAdd,params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    treeUpdate(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.put(api.treeUpdate, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    treeDel(keys=[]){
        return new Promise((resolve, reject) => {
            this.request.post(api.treeDel, keys).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    treeSee(key){
        return new Promise((resolve, reject) => {
            this.request.get(api.treeSee + key).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    getList(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.get(api.getList, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    add(params = {}){
        return new Promise((resolve, reject) => {
            this.request.post(api.add,params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    see(key){
        return new Promise((resolve, reject) => {
            this.request.get(api.see + key).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    del(keys){
        return new Promise((resolve, reject) => {
            this.request.post(api.del, keys).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    tableColumns(){
        let columns:any[] = [];
        let allColumns:any = JSON.parse(JSON.stringify(this.global.allColumns));;//从全局参数中提取表头
        for(let item of allColumns.software){
            item.name = this.appService.translate(item.name);
            //判断当前项目 该页面基础列 和 定制的列 sessionStorage.project这个为获取是什么公司的项目
            if (typeof(item.project) == "undefined" || item.project === sessionStorage.project){
                columns.push(item);
            }
        }
        return columns;
        // return [
        //     {
        //         name: this.appService.translate("sysSoftwareUpdate.vercode"),
        //         code: "vercode"
        //     },
        //     {
        //         name: this.appService.translate("sysSoftwareUpdate.info"),
        //         code: "info"
        //     },
        //     {
        //         name: this.appService.translate("sysSoftwareUpdate.create_time"),
        //         code: "create_time",
        //         width:"160px"
        //     }
        // ]
    }
}
