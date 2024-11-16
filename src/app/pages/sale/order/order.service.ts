import { environment } from "@/environments/environment";
import { Injectable } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { GlobalService } from "~/global";
import { AppService } from "~/shared/services/app.service";
import { RequestService } from "~/shared/services/request.service";
const api = {
    url: '/admin/OrderMaster',
    userRoles :'/admin/userroles',
    userAccount: '/admin/userinfo',
    userGroups: "/admin/groupuser",

    addOrderId:'/admin/OrderMaster/extend/CreateOrderCode',
    
    order:"/admin/OrderMaster",
    confirm:"/admin/OrderMaster/extend/EnsureProduction",
    del:"/admin/OrderMaster/delete",
    orderArrangeDetail:"/admin/OrderDetail/getlist",
    getOrderToWork:'/admin/WorkBill/getlist',
    ksArrangeWorkbill:'/admin/OrderMaster/extend/KSArrangeWorkbill',
    batchSaveByOrder:'/admin/WorkBill/extend/BatchSaveByOrder',
    export:"api/public/OrderDetail/leadingout",
    upExcel:"api/admin/OrderDetail/imp"
}
@Injectable({
    providedIn: 'root'
})
export class OrderSaleService {
    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService,
        private global: GlobalService
    ) { 

    }

    //订单新增
    add(params = {}){
        return new Promise((resolve, reject) => {
            this.request.post(api.order, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //查看详情订单
    see(key){
        return new Promise((resolve, reject) => {
            this.request.get(api.order + '/' + key).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取订单中详情排单
    seeOrderArrangeDetail(params = {}) {
        return new Promise((resolve,reject) =>{
            this.request.get(api.orderArrangeDetail,params).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            })
        })
    }

    //使用订单当前中的排单key获取款式排班数据
    seeOrderToWork(params = {}) {
        return new Promise((resolve,reject) =>{
            this.request.get(api.getOrderToWork,params).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            })
        })
    }

    //修改订单
    update(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.put(api.order, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //一键排单
    ksArrange(params = {}){
        return new Promise((resolve, reject) => {
            this.request.post(api.ksArrangeWorkbill, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //生成作业单
    batchSaveByOrder(params = {}){
        return new Promise((resolve, reject) => {
            this.request.post(api.batchSaveByOrder, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //确认生产
    confirm(params = {}){
        return new Promise((resolve, reject) => {
            this.request.post(api.confirm, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取新增时订单编号
    getOrderId (params = {}) {
        return new Promise((resolve,reject) =>{
            this.request.get(api.addOrderId,params).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            })
        })
    }

    //删除
    del(keys){
        return new Promise((resolve, reject) => {
            this.request.post(api.del, keys).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    getList (params = {}) {
        return new Promise((resolve,reject) =>{
            this.request.get(api.url,params).then(response =>{
                resolve(response)
            }).catch(error =>{
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
        return environment.rootUrl+api.upExcel;
    }
    
    tableColumns(){
        let columns:any[] = [];
        let allColumns:any = JSON.parse(JSON.stringify(this.global.allColumns));//从全局参数中提取表头
        for(let item of allColumns.order){
            item.name = this.appService.translate(item.name);
            //判断当前项目 该页面基础列 和 定制的列 sessionStorage.project这个为获取是什么公司的项目
            if (typeof(item.project) == "undefined" || item.project === sessionStorage.project){
                columns.push(item);
            }
        }
        return columns;
    }
}