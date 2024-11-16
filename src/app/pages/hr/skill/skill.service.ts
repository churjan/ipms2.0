import { environment } from "@/environments/environment";
import { Injectable } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { GlobalService } from "~/global";
import { AppService } from "~/shared/services/app.service";
import { RequestService } from "~/shared/services/request.service";
const api = {
    getList: '/admin/employeeskill',
    del:'/admin/employeeskill/delete',
    download:'download/excel/zh/ColorInfo.xls',
    export:'api/public/employeeskill/leadingout',
    addUserSkill:'/admin/employeeskill',
    delUserSkill:'/admin/employeeskill/delete',
}
@Injectable({
    providedIn: 'root'
})
export class SkillService {
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

    del(keys){
        return new Promise((resolve, reject) => {
            this.request.post(api.del, keys).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    addUserSkill(params = {}){
        return new Promise((resolve, reject) => {
            this.request.post(api.addUserSkill, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    delUserSkill(params = {}){
        return new Promise((resolve, reject) => {
            this.request.post(api.delUserSkill, [params]).then(response => {
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

    //导出地址
    export(name,params = {}){
        this.request.download_file((environment.rootUrl+api.export),params,name);
    }
    
    tableColumns(){
        let columns:any[] = [];
        let allColumns:any = JSON.parse(JSON.stringify(this.global.allColumns));;//从全局参数中提取表头
        for(let item of allColumns.skill){
            item.name = this.appService.translate(item.name);
            //判断当前项目 该页面基础列 和 定制的列 sessionStorage.project这个为获取是什么公司的项目
            if (typeof(item.project) == "undefined" || item.project === sessionStorage.project){
                columns.push(item);
            }
        }
        return columns;
        //  return [
        //     {
        //         name: this.appService.translate("hrSkill.hei_code"),
        //         code: "hei_code",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"200px",
        //     },
        //     {
        //         name: this.appService.translate("hrSkill.hei_name"),
        //         code: "hei_name",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"200px",
        //     },
        //     {
        //         name: this.appService.translate("hrSkill.poi_code"),
        //         code: "poi_code",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"200px",
        //     },
        //     {
        //         name: this.appService.translate("hrSkill.poi_name"),
        //         code: "poi_name",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"250px",
        //     },
        //     {
        //         name: this.appService.translate("hrSkill.a"),
        //         code: "a",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"200px",
        //     },
        //     {
        //         name: this.appService.translate("hrSkill.b"),
        //         code: "b",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"200px",
        //     },
        //     {
        //         name: this.appService.translate("hrSkill.c"),
        //         code: "c",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"200px",
        //     }
        // ]
    }
}