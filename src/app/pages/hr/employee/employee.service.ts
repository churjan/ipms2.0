import { environment } from '@/environments/environment';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from '~/global';
import { AppService } from '../../../shared/services/app.service';
import { RequestService } from '../../../shared/services/request.service';

const api = {
    getTreeListAll: '/admin/organizationinfo/getlist',
    getList: '/admin/employeeinfo',
    classdata: '/admin/classdata/option',
    role: '/admin/roleinfo/option',
    upAvatar: '/FilesInfo',
    add: '/admin/employeeinfo',
    see: '/admin/employeeinfo/',
    update: '/admin/employeeinfo',
    del: '/admin/employeeinfo/delete',
    worksectionAll: '/admin/WorkSectionInfo/Extend/GetMyWorkSectionInfo',
    worksection: '/admin/employeeworksection',
    addRole: '/admin/userroles',
    delRole: '/admin/userroles/delete',
    addWorksection: '/admin/employeeworksection',
    delWorksection: '/admin/employeeworksection/delete',
    updateUser: '/admin/userinfo',
    userList: '/admin/employeeinfo/option',
    getLoginSkill: '/admin/OperationInfo/',
    getUserSkill: '/admin/employeeskill/getlist',
    download: 'download/excel/zh/EmployeeInfo.xls',
    up: 'api/admin/EmployeeInfo/imp',
    export: 'api/public/EmployeeInfo/leadingout',
    sync: '/admin/PullEmployee',

    url: '/admin/employeeinfo',
    userRoles: '/admin/userroles',
    userAccount: '/admin/userinfo',
    userGroups: "/admin/groupuser",

    layoutStructure: "/admin/LayoutStructure/extend/NewGetList",
    userLayoutStructure: "/admin/JindingEmployeeCutStation/getlist",
    addLayoutStructure: "/admin/JindingEmployeeCutStation",
    delLayoutStructure: "/admin/JindingEmployeeCutStation/delete",

    HangLine: "/admin/LayoutStructure/extend/NewGetList",
    userHangLine: "/admin/JindingEmployeeLine/getlist",
    addHangLine: "/admin/JindingEmployeeLine",
    delHangLine: "/admin/JindingEmployeeLine/delete",

    LayoutVirtual: "/admin/VirtualLayout/getlist",
    userLayoutVirtual: "/admin/JindingEmployeeVirtualLine/getlist",
    addHangVirtuallyLine: "/admin/JindingEmployeeVirtualLine",
    delHangVirtuallyLine: "/admin/JindingEmployeeVirtualLine/delete"
}

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService,
        private global: GlobalService
    ) { }

    getUpAcatarUrl() {
        return environment.baseUrl + api.upAvatar;
    }

    //获取组织机构数据
    getTreeListAll(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.get(api.getTreeListAll, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取性别
    classdata(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.get(api.classdata, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取角色
    role(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.get(api.role, params).then(response => {
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

    getName(key) {
        return new Promise((resolve, reject) => {
            this.request.get(api.getList + "/" + key).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    empadd(params = {}) {
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

    empupdate(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.put(api.update, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    empdel(keys) {
        return new Promise((resolve, reject) => {
            this.request.post(api.del, keys).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取当前选中的用户的账户密码等信息
    getUserAccount(key) {
        return new Promise((resolve, reject) => {
            this.request.post(api.userAccount + '/extend/employeeUser', { hei_key: key }).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取选中的用户的全部角色
    getUserRoles(key) {
        return new Promise((resolve, reject) => {
            this.request.get(api.userRoles + '/getlist', { sui_key: key }).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取选中的用户的全部工段
    getUserWorksection(key) {
        return new Promise((resolve, reject) => {
            this.request.get(api.worksection + '/getlist', { hei_key: key }).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取当前登录用户的全部角色
    getLoginUserRoles() {
        return new Promise((resolve, reject) => {
            this.request.get(api.userRoles + '/Extend/GetMyList').then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取当前登录用户的全部工段
    getLoginUserWorksection() {
        return new Promise((resolve, reject) => {
            this.request.get(api.worksectionAll).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //添加角色
    empAddRole(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.post(api.addRole, params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //删除角色
    empDelRole(params = []) {
        return new Promise((resolve, reject) => {
            this.request.post(api.delRole, params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //添加工段
    empAddWorksection(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.post(api.addWorksection, params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //移除工段
    empDelWorksection(params = []) {
        return new Promise((resolve, reject) => {
            this.request.post(api.delWorksection, params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //账户和密码 以及状态的修改
    updateUser(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.put(api.updateUser, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //技能管理中的用户下拉数据
    userList() {
        return new Promise((resolve, reject) => {
            this.request.get(api.userList).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取当前登录账户的全部技能
    getLoginSkill(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.get(api.getLoginSkill, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取当前选中账户的全部技能
    getUserSkill(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.get(api.getUserSkill, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //模版下载地址
    downloadModel() {
        const language =
            (localStorage.getItem('language') || navigator.language).indexOf('zh') != -1 ? 'zh' : 'EN';
        window.open(environment.rootUrl + 'download/excel/' + language + '/EmployeeInfo.xls');
    }

    //上传地址
    upExcel() {
        return environment.rootUrl + api.up;
    }

    //导出地址
    export(name, params = {}) {
        this.request.download_file((environment.rootUrl + api.export), params, name);
    }

    //同步用户信息
    sync(params = []) {
        return new Promise((resolve, reject) => {
            this.request.post(api.sync, params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    get(id) {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve, reject) => {
            this.request.get(api.url + '/' + id).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            }).finally(() => {
                this.message.remove(msgId)
            })
        })
    }

    list(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.get(api.url, params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    add(data) {
        const msgId = this.message.loading(this.appService.translate("placard.dataSaving"), { nzDuration: 0 }).messageId
        return new Promise((resolve, reject) => {
            this.request.post(api.url, data).then(response => {
                this.message.success(response?.message || this.appService.translate("sucess.s_save"))
                resolve(response)
            }).catch(error => {
                reject(error)
            }).finally(() => {
                this.message.remove(msgId)
            })
        })
    }

    update(data, id) {
        data.key = id
        const msgId = this.message.loading(this.appService.translate("placard.dataSaving"), { nzDuration: 0 }).messageId
        return new Promise((resolve, reject) => {
            this.request.post(api.url, data).then(response => {
                this.message.success(response?.message || this.appService.translate("sucess.s_save"))
                resolve(response)
            }).catch(error => {
                reject(error)
            }).finally(() => {
                this.message.remove(msgId)
            })
        })
    }

    del(data) {
        const msgId = this.message.loading(this.appService.translate("dataDeleting"), { nzDuration: 0 }).messageId
        return new Promise((resolve, reject) => {
            this.request.post(api.url + '/delete', data).then(response => {
                this.message.success(response?.message || this.appService.translate("sucess.s_delete"))
                resolve(response)
            }).catch(error => {
                reject(error)
            }).finally(() => {
                this.message.remove(msgId)
            })
        })
    }

    upload(data) {

    }

    userAccount(key) {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve, reject) => {
            this.request.post(api.userAccount + '/extend/employeeUser', { hei_key: key }).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            }).finally(() => {
                this.message.remove(msgId)
            })
        })
    }

    userAccountUpdate(data) {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve, reject) => {
            this.request.post(api.userAccount, data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            }).finally(() => {
                this.message.remove(msgId)
            })
        })
    }

    userRoles(key) {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve, reject) => {
            this.request.get(api.userRoles + '/getlist', { sui_key: key }).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            }).finally(() => {
                this.message.remove(msgId)
            })
        })
    }

    addRole(data) {
        return new Promise((resolve, reject) => {
            this.request.post(api.userRoles, data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    delRole(data) {
        return new Promise((resolve, reject) => {
            this.request.post(api.userRoles + '/delete', data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    userGroups(key) {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve, reject) => {
            this.request.get(api.userGroups + '/getlist', { sui_key: key }).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            }).finally(() => {
                this.message.remove(msgId)
            })
        })
    }

    addGroup(data) {
        return new Promise((resolve, reject) => {
            this.request.post(api.userGroups, data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    delGroup(data) {
        return new Promise((resolve, reject) => {
            this.request.post(api.userGroups + '/delete', data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取上载站数据
    //设备筛选条件 */
    //   stationtype list:[{“name":"普通站Normal"，"value":“1”}(@或不传为查找全部)
    //     1:普通站Normal,
    //     2:上裁站Cut,
    //     3:质检站QC，
    //     4:超载站Overload.
    //     5:筛选站Filter，
    //     6:委外站Outsourcing
    //     7:下衣站offline，
    //     8:桥接站Bridging
    //     10:特殊站Special，
    //     11:变轨站OrbitalTransfer
    //     12:维修站RePair
    //     13:部件配对站MatchingStation,
    //     14:串形站Series，
    //     15:包装站Packing，
    //     20:仓库入口warehouseLoading
    //     21:仓库出口warehouseUnloading,
    //     22:仓位WarehousePostion,
    //     23:仓库通道WarehousePassageway(一百以上为自定义)水水*水水**水*
    //     101:工序路线图内，可以拉工序流的站位 进轨
    //     102: 站位下拉框(除去仓位，桥接等能操作)的站位
    //     103:出货口
    // /api/admin/LayoutStructure/extend/NewGetList?keywords=&maketree=true&moduletype=2&removein=true
    layoutStructure(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.get(api.layoutStructure, params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取员工对应的上载站数据
    userLayoutStructure(params = {}, customized = sessionStorage.project) {
        if (customized) api.userLayoutStructure = api.userLayoutStructure.replace('Jinding', customized)
        return new Promise((resolve, reject) => {
            this.request.get(api.userLayoutStructure, params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //新增用户上载站数据
    addLayoutStructure(params = {}, customized = sessionStorage.project) {
        if (customized) api.addLayoutStructure = api.addLayoutStructure.replace('Jinding', customized)
        return new Promise((resolve, reject) => {
            this.request.post(api.addLayoutStructure, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //添加用户吊挂实体线数据
    addHangLine(params = {}, customized = sessionStorage.project) {
        if (customized) api.addHangLine = api.addHangLine.replace('Jinding', customized)
        return new Promise((resolve, reject) => {
            this.request.post(api.addHangLine, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //添加用户吊挂虚拟线数据
    addHangVirtuallyLine(params = {}, customized = sessionStorage.project) {
        if (customized) api.addHangVirtuallyLine = api.addHangVirtuallyLine.replace('Jinding', customized)
        return new Promise((resolve, reject) => {
            this.request.post(api.addHangVirtuallyLine, params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //移除用户上载站数据
    delLayoutStructure(params = [], customized = sessionStorage.project) {
        if (customized) api.delLayoutStructure = api.delLayoutStructure.replace('Jinding', customized)
        return new Promise((resolve, reject) => {
            this.request.post(api.delLayoutStructure, params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //移除用户吊挂实体线数据
    delHangLine(params = [], customized = sessionStorage.project) {
        if (customized) api.delHangLine = api.delHangLine.replace('Jinding', customized)
        return new Promise((resolve, reject) => {
            this.request.post(api.delHangLine, params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //移除用户吊挂虚拟线数据
    delHangVirtuallyLine(params = [], customized = sessionStorage.project) {
        if (customized) api.delHangVirtuallyLine = api.delHangVirtuallyLine.replace('Jinding', customized)
        return new Promise((resolve, reject) => {
            this.request.post(api.delHangVirtuallyLine, params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //用户配置的实体线
    userHangLine(params = {}, customized = sessionStorage.project) {
        if (customized) api.userHangLine = api.userHangLine.replace('Jinding', customized)
        return new Promise((resolve, reject) => {
            this.request.get(api.userHangLine, params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取全部吊挂实线数据
    hangLine(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.get(api.HangLine, params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取全部虚拟线数据
    LayoutVirtual(params = {}) {
        return new Promise((resolve, reject) => {
            this.request.get(api.LayoutVirtual, params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //用户配置的虚拟线数据
    userLayoutVirtual(params = {}, customized = sessionStorage.project) {
        if (customized) api.userLayoutVirtual = api.userLayoutVirtual.replace('Jinding', customized)
        return new Promise((resolve, reject) => {
            this.request.get(api.userLayoutVirtual, params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    tableColumns() {
        let columns: any[] = [];
        let allColumns: any = JSON.parse(JSON.stringify(this.global.allColumns));;//从全局参数中提取表头
        for (let item of allColumns.employee) {
            item.name = this.appService.translate(item.name);
            //判断当前项目 该页面基础列 和 定制的列 sessionStorage.project这个为获取是什么公司的项目
            if (typeof (item.project) == "undefined" || item.project === sessionStorage.project) {
                columns.push(item);
            }
        }
        return columns;
        // return [
        //     {
        //         name: this.appService.translate("hrEmployee.code"),
        //         code: "code",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"180px",
        //     },
        //     {
        //         name: this.appService.translate("hrEmployee.name"),
        //         code: "name",
        //         format: "toName",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"150px",
        //     },
        //     {
        //         name: this.appService.translate("hrEmployee.sex"),
        //         code: "sex",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"150px",
        //     },
        //     {
        //         name: this.appService.translate("hrEmployee.hoi_name"),
        //         code: "hoi_name",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"180px",
        //     },
        //     {
        //         name: this.appService.translate("hrEmployee.attendanceid"),
        //         code: "attendanceid",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"200px",
        //     },
        //     {
        //         name: this.appService.translate("hrEmployee.phone"),
        //         code: "phone",
        //         tip: true,
        //         isOverflow:true,//溢出省略号
        //         width:"200px",
        //     }
        // ]
    }
}
