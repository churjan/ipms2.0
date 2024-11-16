import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject } from 'rxjs';
import { GlobalService } from '~/global';
import { environment } from '../../../../environments/environment'
import { AppService } from '../app.service';
import { AppConfig, modularList } from '../AppConfig.service';
import { RequestService } from '../request.service';
import { UtilService } from '../util.service';
declare var $: any;

export const api = {
    login: '/login',
    userMenu: '/admin/system/extend/menu/',
    userInfo: '/admin/employeeinfo',
    language: '/admin/languageversion/getlist',
    password: '/admin/userinfo/extend/updatapassword',
    logout: '/logout',
    Register: 'register/verifyRegisterTxt'
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    userInfo$ = new BehaviorSubject<object>(null)
    language$ = new BehaviorSubject<object>(null)
    permissions$ = new BehaviorSubject<object>(null)
    menu$ = new BehaviorSubject<object>(null)
    menuData = new Array()

    constructor(
        private request: RequestService,
        private appService: AppService,
        private message: NzMessageService,
        private utilService: UtilService,
        private global: GlobalService
    ) {
    }
    /**登录 */
    login(data: object): Promise<void> {
        return new Promise((resolve, reject) => {
            this.request.post(api.login, { ...data, method: "login" }).then(response => {
                localStorage.setItem("userInfo", this.utilService.aesEncrypt(JSON.stringify(response.employee)))
                // localStorage.setItem(environment.tokenKey, response.token);
                sessionStorage.userkey = response.employee.hei_key;
                sessionStorage.usercode = response.employee.hei_code;
                sessionStorage.hoi_key = response.employee.hoi_key ? response.employee.hoi_key : '';
                sessionStorage.istab = true;
                sessionStorage.lastlogintime = response.lastlogintime ? response.lastlogintime : '';
                sessionStorage.ticket = response.token;
                sessionStorage.isadmin = response.isadmin ? response.isadmin : false;
                sessionStorage.expiretime = response.expiretime;
                sessionStorage.bwi_list = null;
                if (response.bwi_list) {
                    let _bwi = '';
                    _bwi = JSON.stringify(response.bwi_list);
                    sessionStorage.bwi_list = _bwi;
                }
                this.getUserMenu()
                resolve()
            }).catch(() => {
                reject()
            })
        })
    }
    async systemnameUrl(): Promise<any> {
        const that = this;
        this.request.get('SystemInfo/getprojectname/', {}).then((result) => {
            sessionStorage.project = result;
            //测试效果
            for (let m in AppConfig.extend[sessionStorage.project]) {
                modularList[m] = Object.assign({}, modularList[m], AppConfig.extend[sessionStorage.project][m]);
                if (AppConfig.extend[sessionStorage.project][m].columns) {
                    AppConfig.columns[m] = [];
                    AppConfig.columns[m] = [...AppConfig.extend[sessionStorage.project][m].columns]
                }
                if (AppConfig.extend[sessionStorage.project][m].fields) {
                    AppConfig.fields[m] = !AppConfig.fields[m] ? [] : AppConfig.fields[m];
                    AppConfig.fields[m].push(...AppConfig.extend[sessionStorage.project][m].fields)
                }
            }
        }).catch(() => { });
    }
    Registerverify(data = {}) {
        return new Promise((resolve, reject) => {
            this.request.post(api.Register, data).then((response) => {
                // this.systemnameUrl();
                let sys = UtilService.isEmpty(response.systemname) == true ? 'IPMS' : response.systemname;
                sessionStorage.sys = sys;
                sessionStorage.sysName = response.fullsystemname;
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    }
    // system_Config(success?: Function, error?: Function): any {
    //     const that = this;
    //     if (UtilService.isEmpty(sessionStorage.systemConfig) || sessionStorage.version != AppConfig.version || sessionStorage.systemConfig === 'undefined'
    //         || sessionStorage.systemConfig === 'null') {
    //         sessionStorage.version = AppConfig.version
    //         that.systemnameUrl();
    //         // that.Helper();
    //         that.request.get(AppConfig.Config.systemUrl, {}).then((result) => {
    //             sessionStorage.systemConfig = JSON.stringify(result.data);
    //             success(result.data);
    //         }).finally((err) => {
    //             // that.router.navigate(['/install']);
    //         });
    //     } else {
    //         const _config = sessionStorage.systemConfig;
    //         success(JSON.parse(_config));
    //     }
    // }
    /**登录人获取 */
    getUserInfo() {
        const userInfo = JSON.parse(this.utilService.aesDecrypt(localStorage.getItem("userInfo")))
        const url = api.userInfo + '/' + userInfo.hei_key
        this.request.get(url).then(response => {
            this.userInfo$.next(response || {});
        }).finally(() => { })
    }
    /**菜单获取 */
    getUserMenu() {
        this.request.get(api.userMenu).then(response => {
            this.menuData = response;
            this.global.munuList = this.menuData;//munuList为菜单全局变量
            this.permissions$.next(this.getPermissions(response))
            this.menu$.next(this.initMenus(response));
            this.OperPro()
        })
    }
    /**语言获取 */
    getLanguage() {
        this.request.get(api.language).then(response => {
            this.language$.next(response)
        })
    }
    /**修改密码 */
    changePassword(data) {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve, reject) => {
            this.request.post(api.password, data).then(response => {
                this.message.success(response?.message || this.appService.translate("account.updateSuccess"))
                resolve(response)
            }).catch(error => {
                reject(error)
            }).finally(() => {
                this.message.remove(msgId)
            })
        })
    }
    /**退出 */
    logout() {
        this.appService.clearAndLogout(true)
        /* this.request.delete(api.logout).finally(() =>{
            this.appService.clearAndLogout()
        }) */
    }
    /**注册信息 */
    Register(url, body, success?, err?) {
        return new Promise((resolve, reject) => {
            return this.request.post(url, body).then(function (result) { success(result.data) }).finally((error) => {
                err(error)
            });
        })
    }

    /**工序流权限 */
    OperPro(): any {
        let OperProUrl = environment.OperProUrl;
        this.request.get(OperProUrl).then((power) => {
            // localStorage.setItem('process',power.haveoperationprocess);
            sessionStorage.process = power.haveoperationprocess;
            sessionStorage.processroute = power.haveoperationprocessroute;
            sessionStorage.havewages = power.havewages;
        }).finally(() => { })
    }
    initMenus(data) {
        if (!data || data.length <= 0) return []
        return data.map(item => {
            /* let title = null
                if(item.url){
                    const url = item.url.substring(1,item.url.length)
                    if(url){
                        const pathKey = url.replace(/\//g,"_")
                        title = this.appService.translate(`url.${pathKey}`)
                    }
                } */
            const temp = {
                title: item.name,
                icon: item.icon && item.icon.search('fa') >= 0 ? '' : item.icon,
                url: item.url.replace('admin/', ""),
                children: [],
                ismenu: item.ismenu
            }
            if (item.sonlist && item.sonlist.length > 0) {
                temp.children = this.initMenus(item.sonlist)
            }
            return temp
        })
    }

    getPermissions(data: any[]) {
        let result = [];
        if (data) {
            data.forEach(item => {
                if (!item.url) { item.url = ''; }
                // if (item.ismenu == 1) return
                if (item.icon && item.icon.search('fa') >= 0) item.icon = '';
                let url = item.url.replace('admin/', "").replace(/\//g, "_")
                if (url.indexOf("_") == 0) {
                    url = url.substring(1, url.length)
                }
                result.push(url)
                if (item.menubuttondtolist?.length > 0) {
                    item.menubuttondtolist.forEach(ite => {
                        const action = ite.action.toLowerCase()
                        const node = `${url}_${action}`
                        result.push(node)
                    })
                }
                if (item.sonlist?.length > 0) {
                    const res = this.getPermissions(item.sonlist)
                    result = result.concat(res)
                }
            })
        }
        return result
    }
    getAuthority(id: string, ismun: number = 0, action: string = '') {
        let resule = [];
        let idUrl = id.split('_');
        if (this.menuData) {
            this.menuData.forEach(m => {
                if (resule && resule.length > 0) { return; }
                if (m['url'] && m['url'] === ('/' + idUrl[0])) {
                    resule = this.Circulates(m, idUrl, ismun, action, 1, ('/' + idUrl[0]), id);
                }
            });
        }
        return resule;
    }
    //按钮信息分类
    getBtn(id: string, ismun: number = 0, action: string = '', menuData = this.menuData) {
        let resule = [];
        let idUrl = id.split('_');
        if (menuData) {
            menuData.forEach(m => {
                if (resule && resule.length > 0) { return; }
                // if (m['url'] && m['url'] === ('/' + idUrl[0])) {
                resule = this.Circulates(m, idUrl, ismun, action, 1, ('/' + idUrl[0]), id);
                // }
            });
        }
        let btn = resule.filter(b => !b.speciallimits || b.speciallimits == 0);
        let model: any = {};
        btn = btn.sort((x, n) => x.isextend - n.isextend);
        model['common'] = btn.filter(r => r.isradio != true || r.action == "Del");
        model['single'] = btn.filter((r, i) => r.isradio == true && (r.isextend == false || r.isextend == null));
        model['extend'] = btn.filter((r, i) => r.isradio == true && r.isextend == true);
        model['hasPermission'] = Array.from(model['extend'], (juris) => juris['juris']);
        model['special'] = resule.filter(b => b.speciallimits && b.speciallimits != 0);
        return model;
    }
    //不同的分类方式
    // getBtnZ(id: string, ismun: number = 0, action: string = '') {
    //     let resule = [];
    //     let idUrl = id.split('_');
    //     if (this.menuData) {
    //         this.menuData.forEach(m => {
    //             if (resule && resule.length > 0) { return; }
    //             // if (m['url'] && m['url'] === ('/' + idUrl[0])) {
    //             resule = this.Circulates(m, idUrl, ismun, action, 1, ('/' + idUrl[0]), id);
    //             // }
    //         });
    //     }
    //     resule = resule.sort((x, n) => x.isextend - n.isextend);
    //     let model: any = {};
    //     model['top'] = resule.filter(r => r.isradio != true);
    //     model['table'] = resule.filter((r, i) => r.isradio == true || r.action == "del");
    //     model['fold'] = model['table'].filter((r, i) => r.isextend == true);
    //     model['noFold'] = model['table'].filter((r, i) => r.isextend != true);
    //     return model;
    // }
    //最新格式化菜单数据
    getBtnZAll(menuData = [], id: string, ismun: number = 0, action: string = '') {
        let resule = [];
        let idUrl = id.split('_');
        if (menuData) {
            menuData.forEach(m => {
                if (resule && resule.length > 0) { return; }
                // if (m['url'] && m['url'] === ('/' + idUrl[0])) {
                resule = this.Circulates(m, idUrl, ismun, action, 1, ('/' + idUrl[0]), id);
                // }
            });
        }
        let btn = resule.filter(b => !b.speciallimits || b.speciallimits == 0);
        btn = btn.sort((x, n) => x.isextend - n.isextend);
        let model: any = {};
        model['top'] = btn.filter(r => r.isradio != true);
        model['table'] = btn.filter((r, i) => r.isradio == true || r.action == "del");
        model['fold'] = model['table'].filter((r, i) => r.isextend == true);
        model['noFold'] = model['table'].filter((r, i) => r.isextend != true);
        model['special'] = resule.filter(b => b.speciallimits && b.speciallimits != 0);
        return model;
    }
    //按钮信息不分类
    getBtnAll(id: string, ismun: number = 0, action: string = '') {
        let resule = [];
        let idUrl = id.split('_');
        if (this.menuData) {
            this.menuData.forEach(m => {
                if (resule && resule.length > 0) { return; }
                // if (m['url'] && m['url'] === ('/' + idUrl[0])) {
                resule = this.Circulates(m, idUrl, ismun, action, 1, ('/' + idUrl[0]), id);
                // }
            });
        }
        resule = resule.sort((x, n) => x.isextend - n.isextend);
        return resule;
    }
    Circulates(m, idUrl?, ismun?, action?, i = 1, id?, Header?) {
        const that = this;
        let resule = new Array();
        if (m.sonlist) {
            let s = m.sonlist.find(x => x.url && x.url.replace('admin/', "") === id + '/' + idUrl[i]);
            if (!s) {
                // m.sonlist.forEach(c => {
                //     if (resule && resule.length > 0) { return; }
                //     i++;
                //     resule = this.Circulates(c, idUrl, ismun, action, i, id, Header);
                // })
            } else {
                if (i != idUrl.length - 1) {
                    i++;
                    resule = this.Circulates(s, idUrl, ismun, action, i, s.url.replace('admin/', ""), Header);
                } else {
                    if (ismun == 1) {
                        s.sonlist.forEach(l => {
                            if (l.action == action) {
                                if (l.menubuttondtolist) {
                                    l.menubuttondtolist.forEach(lm => {
                                        if (lm.icon && lm.icon.search('fa') >= 0) lm.icon = '';
                                        let mbtn = Object.assign(lm, { juris: Header + '_' + lm.action })
                                        resule.push(mbtn)
                                    })
                                }
                            }
                        });
                    } else {
                        if (s.menubuttondtolist) {
                            s.menubuttondtolist.forEach(lm => {
                                if (lm.icon && lm.icon.search('fa') >= 0) lm.icon = '';
                                let mbtn = Object.assign(lm, { juris: Header + '_' + lm.action })
                                if (s.sonlist) {
                                    let smodel = s.sonlist.find(d => d.name == mbtn.name)
                                    if (smodel) {
                                        let stl = this.Circulates(smodel, idUrl, ismun, action, i, '', Header);
                                        let _stl = stl.filter(b => !b.speciallimits || b.speciallimits == 0);
                                        let sonbtn: any = {};
                                        sonbtn['common'] = _stl.filter(r => r.isradio != true || r.action == "Del");
                                        sonbtn['single'] = _stl.filter((r, i) => r.isradio == true && (r.isextend == false || r.isextend == null));
                                        sonbtn['extend'] = _stl.filter((r, i) => r.isradio == true && r.isextend == true);
                                        sonbtn['hasPermission'] = Array.from(sonbtn['extend'], (juris) => juris['juris']);
                                        sonbtn['special'] = stl.filter(b => b.speciallimits && b.speciallimits != 0);
                                        mbtn = Object.assign(mbtn, { sonbtn: sonbtn })
                                    }
                                }
                                resule.push(mbtn)
                            })
                        }
                    }
                }
            }
        } else if (m.ismenu == 1) {
            if (m.menubuttondtolist) {
                m.menubuttondtolist = m.menubuttondtolist.sort((x, n) => x.isextend - n.isextend);
                m.menubuttondtolist.forEach(lm => {
                    if (lm.icon && lm.icon.search('fa') >= 0) lm.icon = '';
                    let mbtn = Object.assign(lm, { juris: Header + '_' + lm.action })
                    resule.push(mbtn)
                })
            }
        }
        return resule;
    }
}
