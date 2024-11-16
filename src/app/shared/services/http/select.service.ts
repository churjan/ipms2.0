import { Injectable } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { AppService } from "../app.service";
import { RequestService } from "../request.service";
const api = {
    line:'/admin/layoutstructure/lines',
    quarter: '/admin/quarterinfo/option',
    style:'/admin/styleinfo/option',
    color:'/admin/colorinfo/option',
    bpi:'/admin/partinfo/option',
    type:'/admin/Enum/',
    order:'/admin/order/',
    work:'/admin/WorkBill/',
    orgtype:'/admin/classdata/option?pcode=orgtype',
    softwareType:'/admin/SoftwareClass/getlist',
    size:'/admin/sizeinfo/option',
    customer:'/admin/customerinfo/option',
    businessType:'/admin/Enum',
    classdata:'/admin/classdata/option',
    user:"/admin/employeeinfo/option",
    operationInfo:"/admin/OperationInfo",
    employeeSkill:"/admin/employeeskill/getlist",
}
@Injectable({
    providedIn: 'root',
})
export class SelectService {
    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService
    ) {}
    //获取用户下拉
    userDown(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.user, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取工序下拉
    operationDown(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.operationInfo, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取对应用户所有工序
    employeeSkillDown(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.employeeSkill, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取销售渠道
    distributionChannelDown(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.classdata, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取后端返回的常规值 比如 订单中的 新建 生产中 等参数
    EnumDown(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.businessType, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取客户
    customerDown(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.customer, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //生产线
    lineDown(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.line, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //季度
    quarterDown(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.quarter, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //款式
    styleDown(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.style, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //颜色
    colorDown(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.color, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //部件
    bpiDown(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.bpi, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //类型
    typeDown(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.type, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取订单下拉
    orderDown(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.order, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //作业单号
    workDown(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.work, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //部门类型
    orgtype(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.orgtype, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //软件分类
    softwareType(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.softwareType, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //尺码分类
    sizeType(params = {}){
        return new Promise((resolve, reject) => {
            this.request.get(api.size, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        }) 
    }
}