import { environment } from "@/environments/environment";
import { Injectable } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { GlobalService } from "~/global";
import { AppService } from "~/shared/services/app.service";
import { RequestService } from "~/shared/services/request.service";
const api = {
    getList: '/admin/colorinfo',
    add:'/admin/colorinfo',
    see:'/admin/colorinfo/',
    update:'/admin/colorinfo',
    del:'/admin/colorinfo/delete',
    download:'download/excel/zh/ColorInfo.xls',
    up:'api/admin/ColorInfo/imp',
    export:'api/public/ColorInfo/leadingout'
}
@Injectable({
    providedIn: 'root'
})
export class ColorService {
    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService,
        private global: GlobalService
    ) { }

    getList(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.get(api.getList, params).then(response => {
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

    del(keys){
        return new Promise((resolve, reject) => {
            this.request.post(api.del, keys).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //模版下载地址
    downloadModel(){
        const language =
            (localStorage.getItem('language') || navigator.language).indexOf('zh')!=-1?'zh':'EN';
        window.open(environment.rootUrl+'download/excel/'+language+'/ColorInfo.xls');
    }

    //上传地址
    upExcel(){
        return environment.rootUrl+api.up;
    }

    //导出地址
    export(name,params = {}){
        this.request.download_file((environment.rootUrl+api.export),params,name);
    }
    
    tableColumns(){
        let columns:any[] = [];
        let allColumns:any = JSON.parse(JSON.stringify(this.global.allColumns));;//从全局参数中提取表头
        for(let item of allColumns.color){
            item.name = this.appService.translate(item.name);
            //判断当前项目 该页面基础列 和 定制的列 sessionStorage.project这个为获取是什么公司的项目
            if (typeof(item.project) == "undefined" || item.project === sessionStorage.project){
                columns.push(item);
            }
        }
        return columns;
        //  return [
        //     {
        //         name: this.appService.translate("pdmcolor.code"),
        //         code: "code",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"250px",
        //     },
        //     {
        //         name: this.appService.translate("pdmcolor.name"),
        //         code: "name",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"350px",
        //     },
        //     {
        //         name: this.appService.translate("pdmcolor.customcode"),
        //         code: "customcode",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"250px",
        //     },
        //     {
        //         name: this.appService.translate("pdmcolor.description"),
        //         code: "description",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"500px",
        //     }
        // ]
    }
}