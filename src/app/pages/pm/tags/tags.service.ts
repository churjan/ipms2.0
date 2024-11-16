import { environment } from '@/environments/environment';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from '~/global';
import { AppService } from '../../../shared/services/app.service';
import { RequestService } from '../../../shared/services/request.service';

const api = {
    list: '/admin/taginfo',
    url: '/admin/taginfo',
    parts:'/Public/taginfo/parts',
    new:'/admin/TagProductionRecord/getlist',
    delReProduction:'/admin/TagProductionRecord/delete',
    delAllReProduction:'/admin/taginfo/extend/ProductionAgain',
    export:'',
    up:'api/admin/TagInfo/imp'
}

@Injectable({
    providedIn: 'root'
})
export class TagsService {

    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService,
        private global: GlobalService
    ) { }

    getList(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.get(api.list, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    see(key){
        return new Promise((resolve, reject) => {
            this.request.get(api.list+'/'+key).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    parts(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.parts,params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    new(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.new,params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    delReProduction(keys){
        return new Promise((resolve, reject) => {
            this.request.post(api.delReProduction, keys).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    delAllReProduction(key){
        return new Promise((resolve, reject) => {
            this.request.post(api.delAllReProduction, key).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //导出地址
    export(name,params = {}){
        this.request.download_file((environment.rootUrl+api.export),params,name);
    }

    //上传地址
    upExcel(){
        return environment.rootUrl+api.up;
    }

    //模版下载地址
    downloadModel(){
        const language =
            (localStorage.getItem('language') || navigator.language).indexOf('zh')!=-1?'zh':'EN';
        window.open(environment.rootUrl+'download/excel/'+language+'/TagInfo.xls');
    }

    tableColumns(){
        let columns:any[] = [];
        let allColumns:any = JSON.parse(JSON.stringify(this.global.allColumns));;//从全局参数中提取表头
        for(let item of allColumns.tags){
            item.name = this.appService.translate(item.name);
            //判断当前项目 该页面基础列 和 定制的列 sessionStorage.project这个为获取是什么公司的项目
            if (typeof(item.project) == "undefined" || item.project === sessionStorage.project){
                columns.push(item);
            }
        }
        return columns;
        // return [
        //     {
        //         name: this.appService.translate("pmTags.pwb_code"),
        //         code: "pwb_code",
        //         tip: true,
        //         width: "200px",
        //         isOverflow:true,//溢出省略号
        //     },
        //     {
        //         name: this.appService.translate("pmTags.serialcode"),
        //         code: "serialcode",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width: "160px"
        //     },
        //     {
        //         name: this.appService.translate("pmTags.psi_name"),
        //         code: "psi_name",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width: "160px"
        //     },
        //     {
        //         name: this.appService.translate("pmTags.psi_code"),
        //         code: "psi_code",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width: "160px"
        //     },
        //     {
        //         name: this.appService.translate("pmTags.style_name"),
        //         code: "style_name",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width: "120px"
        //     },
        //     {
        //         name: this.appService.translate("pmTags.bpi_name"),
        //         code: "bpi_name",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width: "160px"
        //     },
        //     {
        //         name: this.appService.translate("pmTags.bpi_ismain"),
        //         code: "bpi_ismain",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         format: "boolean",
        //         width: "160px"
        //     },
        //     {
        //         name: this.appService.translate("pmTags.state_name"),
        //         code: "state_name",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width: "160px"
        //     },
        //     {
        //         name: this.appService.translate("pmTags.tagcode"),
        //         code: "tagcode",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         format:"code_1D",
        //         width: "200px"
        //     }
        // ]
    }
    
}
