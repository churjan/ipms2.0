import { Injectable } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { GlobalService } from "~/global";
import { AppService } from "~/shared/services/app.service";
import { RequestService } from "~/shared/services/request.service";
const test = "http://172.16.105.78:5001/api"
const api = {
    tree: '/admin/LayoutStructure/getlist',
    getList: '/admin/report/HangerFlowReport/GetAllList',
}
@Injectable({
    providedIn: 'root'
})
export class HangerFlowService {
    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService,
        private global: GlobalService
    ) { }

    //工作线
    treeDown(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.tree, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //站位列表
    getList(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.get(api.getList, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    tableColumns(){
        let columns:any[] = [];
        let allColumns:any = JSON.parse(JSON.stringify(this.global.allColumns));;//从全局参数中提取表头
        for(let item of allColumns.hangerFlow){
            item.name = this.appService.translate(item.name);
            //判断当前项目 该页面基础列 和 定制的列 sessionStorage.project这个为获取是什么公司的项目
            if (typeof(item.project) == "undefined" || item.project === sessionStorage.project){
                columns.push(item);
            }
        }
        return columns;
    //     return [
    //        {
    //            name: this.appService.translate("layoutStationSupervisoryControl.station_code"),
    //            code: "station_code",
    //            tip: true,
    //         //    isOverflow:true,//溢出省略号
    //            width:"100px",
    //        },
    //        {
    //            name: this.appService.translate("layoutStationSupervisoryControl.station_type_name"),
    //            code: "station_type_name",
    //            tip: true,
    //         //    isOverflow:true,//溢出省略号
    //            width:"100px",
    //         },
    //        {
    //            name: this.appService.translate("layoutStationSupervisoryControl.station_state_name"),
    //            code: "station_state_name",
    //            tip: true,
    //         //    isOverflow:true,//溢出省略号
    //            width:"90px",
    //        },
    //        {
    //            name: this.appService.translate("layoutStationSupervisoryControl.pad_mac"),
    //            code: "pad_mac",
    //            tip: true,
    //         //    isOverflow:true,//溢出省略号
    //            width:"200px",
    //        },
    //        {
    //            name: this.appService.translate("layoutStationSupervisoryControl.employee_name"),
    //            code: "employee_name",
    //            tip: true,
    //         //    isOverflow:true,//溢出省略号
    //            width:"110px",
    //        },
    //        {
    //            name: this.appService.translate("layoutStationSupervisoryControl.current_operation"),
    //            code: "current_operation",
    //            tip: true,
    //            isOverflow:true,//溢出省略号
    //            width:"150px",
    //        },
    //        {
    //            name: this.appService.translate("layoutStationSupervisoryControl.last_doing_carrier_code"),
    //            code: "last_doing_carrier_code",
    //            tip: true,
    //         //    isOverflow:true,//溢出省略号
    //            width:"160px",
    //        },
    //        {
    //            name: this.appService.translate("layoutStationSupervisoryControl.last_out_carrier_code"),
    //            code: "last_out_carrier_code",
    //            tip: true,
    //         //    isOverflow:true,//溢出省略号
    //            width:"160px",
    //        },
    //        {
    //            name: this.appService.translate("layoutStationSupervisoryControl.infeeds"),
    //            code: "infeeds",
    //            format:"infeeds",
    //            width:"230px",
    //            right:true,//右边固定
    //        }
    //    ]
   }
}