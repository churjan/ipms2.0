import { environment } from '@/environments/environment';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from '~/global';
import { AppService } from '../../../shared/services/app.service';
import { RequestService } from '../../../shared/services/request.service';

const api = {
    newGetList: '/admin/LayoutStructure/extend/NewGetList',
    getList:'/admin/CarrierRunning',
    mark: '/admin/CarrierRunning/Extend/SetAbnormalBatch',
}

@Injectable({
    providedIn: 'root'
})
export class SpecialCoatHangerMarkService {

    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService,
        private global: GlobalService
    ) { }

    //获取工作站
    newGetList(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.newGetList, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    getList(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.getList, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //标记异常
    mark(keys){
        return new Promise((resolve, reject) => {
            this.request.post(api.mark, keys).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    tableColumns(){
        let columns:any[] = [];
        let allColumns:any = JSON.parse(JSON.stringify(this.global.allColumns));;//从全局参数中提取表头
        for(let item of allColumns.specialCoatHangerMark){
            item.name = this.appService.translate(item.name);
            //判断当前项目 该页面基础列 和 定制的列 sessionStorage.project这个为获取是什么公司的项目
            if (typeof(item.project) == "undefined" || item.project === sessionStorage.project){
                columns.push(item);
            }
        }
        return columns;
        // return [
        //     {
        //         name: this.appService.translate("pmSpecialCoatHangerMark.hangerid"),
        //         code: "hangerid",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"180px",
        //         format: "toHangerid",
        //     },
        //     {
        //         name: this.appService.translate("pmSpecialCoatHangerMark.tagcode"),
        //         code: "tagcode",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"150px",
        //     },
        //     {
        //         name: this.appService.translate("pmSpecialCoatHangerMark.pwb_code"),
        //         code: "pwb_code",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"150px",
        //     },
        //     {
        //         name: this.appService.translate("pmSpecialCoatHangerMark.psi_name"),
        //         code: "psi_name",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"180px",
        //     },
        //     {
        //         name: this.appService.translate("pmSpecialCoatHangerMark.psi_code"),
        //         code: "psi_code",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"180px",
        //     },
        //     {
        //         name: this.appService.translate("pmSpecialCoatHangerMark.pci_name"),
        //         code: "pci_name",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"200px",
        //     },
        //     {
        //         name: this.appService.translate("pmSpecialCoatHangerMark.psz_name"),
        //         code: "psz_name",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"200px",
        //     },
        //     {
        //         name: this.appService.translate("pmSpecialCoatHangerMark.isabnormal"),
        //         code: "isabnormal",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"200px",
        //         format: "isOk",
        //     },
        //     {
        //         name: this.appService.translate("pmSpecialCoatHangerMark.destinationlocation_code"),
        //         code: "destinationlocation_code",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"200px",
        //     },
        //     {
        //         name: this.appService.translate("pmSpecialCoatHangerMark.currentlocation_code"),
        //         code: "currentlocation_code",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"200px",
        //     },
        //     {
        //         name: this.appService.translate("pmSpecialCoatHangerMark.currenttype_str"),
        //         code: "currenttype_str",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"200px",
        //     }
        // ]
    }
}
