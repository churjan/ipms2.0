import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../../../environments/environment'
import zh from '../../../../environments/zh'
import { AppConfig, modularList } from '../AppConfig.service';
import { RequestService } from '../request.service';

const api = {
    url: '/Language/UITranslate',
    menuurl: '/Language/GetMenuTranslate',
}
@Injectable({
    providedIn: 'root'
})
export class StartService {
    conversion = new Array();
    extend = new Array();;
    constructor(
        private httpClient: HttpClient,
        private message: NzMessageService,
        private request: RequestService) {
        let { comm, columns, fields, modular, padMonitor, extend, select } = environment.interface
        this.request.getSync(comm, (data) => {
            let tmodular = new Array();
            AppConfig.common = data;
            for (let tip in data) { tmodular.push({ name: data[tip], code: tip }) }
            this.conversion.push({ modular: 'common', fields: tmodular });
        });
        this.request.getSync(columns, (data) => { AppConfig.columns = data; });
        this.request.getSync(fields, (data) => { AppConfig.fields = data; });
        this.request.getSync(modular, (data) => {
            for (let m in data) {
                modularList[m] = Object.assign({}, modularList[m], data[m])
            }
        });
        this.request.getSync(padMonitor, (data) => {
            modularList['padMonitor'] = Object.assign({}, modularList['padMonitor'], data);
            AppConfig.fields['padMonitor'] = data.fields
            AppConfig.columns['padMonitor'] = data.columns
        });
        this.request.getSync(extend, (data) => { this.extend = data; });
        this.request.getSync(select, (data) => { AppConfig.select = data; });//获取全部下拉接口地址json
        // AppConfig.translate=Object.assign({}, AppConfig.buttonList,AppConfig.common,AppConfig.dictionaries)
    }

    getFinalValue(key, subkey, data = AppConfig) {
        const rule = /^\$\{(.*?)\}$/;
        const value = data[key][subkey]
        if (rule.test(value)) {
            const keys = value.match(rule)[1].split('.')
            return this.getFinalValue(keys[0], keys[1])
        } else {
            return value
        }
    }

    async translate() {
        const translate = localStorage.getItem("translate")
        const version = localStorage.getItem("version")
        // if (translate && version && version == environment.version) {
        //     return Promise.resolve("...")
        // }
        if (sessionStorage.project) {
            for (let m in this.extend[sessionStorage.project]) {
                modularList[m] = Object.assign({}, modularList[m], this.extend[sessionStorage.project][m]);
                if (this.extend[sessionStorage.project][m].columns) {
                    AppConfig.columns[m] = [];
                    AppConfig.columns[m] = [...this.extend[sessionStorage.project][m].columns]
                }
                if (this.extend[sessionStorage.project][m].fields) {
                    AppConfig.fields[m] = !AppConfig.fields[m] ? [] : AppConfig.fields[m];
                    AppConfig.fields[m].push(...this.extend[sessionStorage.project][m].fields)
                }
            }
        }
        AppConfig.extend = this.extend;
        if (version != environment.version) {
            const headers = new HttpHeaders()
                .set("Cache-Control", "no-cache")
                .set("Pragma", "no-cache");
            this.httpClient
                .get("", { headers, responseType: "text" })
                .subscribe(() => location.reload());
            localStorage.setItem("version", environment.version)
            return;
        }
        sessionStorage.removeItem('routersData')//清一下缓存路由信息
        const data = []
        for (let key in AppConfig) {
            const fields = [];
            if (typeof AppConfig[key] == 'object' && (key == 'common' || key == 'fields')) {
                if (key == 'fields') {
                    for (let k in AppConfig[key]) {
                        data.push({ modular: k, fields: AppConfig[key][k] })
                    }
                } else {
                    for (let k in AppConfig[key]) {
                        if (typeof AppConfig[key][k] == 'object') {
                            let ch = [];
                            for (let m in AppConfig[key][k]) {
                                const chvalue = this.getFinalValue(k, m, AppConfig[key])
                                ch.push({ code: m, name: chvalue })
                            }
                            fields.push({ modular: k, fields: ch })
                        } else {
                            const value = this.getFinalValue(key, k)
                            fields.push({ code: k, name: value })
                        }
                    }
                    data.push({ modular: key, fields: fields })
                }
            }

        }
        /**预加载 */
        let Preload = data.filter(d => d.modular == 'padMonitor' || d.modular == "hanger" || d.modular == "common" || d.modular == 'User');
        if (localStorage.lastUrl) {
            let num = localStorage.lastUrl.search('_')
            let modularName = localStorage.lastUrl.replace(/\_/g, "")
            modularName = modularName.slice(0, num) + modularName.charAt(num).toUpperCase() + modularName.slice(num + 1)
            Preload = data.filter(d => d.modular == 'padMonitor' || d.modular == "hanger" || d.modular == "common" || d.modular == 'User' || d.modular == modularName);
        }
        /**缓 */
        AppConfig.slow = data.filter(d => d.modular != 'padMonitor' && d.modular != "hanger" && d.modular != "common" && d.modular != 'User')
        let translatelist = {}
        await this.request.GetUITranslate(Preload).then((response: any) => {
            translatelist = Object.assign({}, response);
            AppConfig.translate = Object.assign(AppConfig.translate, response);
            localStorage.setItem("translate", JSON.stringify(response))
            localStorage.setItem("version", environment.version)
        })
        // this.request.GetUITranslate(slow).then((response: any) => {
        //     translatelist = Object.assign(AppConfig.translate, response);
        //     AppConfig.translate = Object.assign(AppConfig.translate, response);
        //     localStorage.setItem("translate", JSON.stringify(translatelist))
        //     localStorage.setItem("version", environment.version)
        // })
        await this.GetMenuTranslate().then((response: any) => {
            response.forEach(item => {
                if (item.code) {
                    const url = item.code.substring(1, item.code.length)
                    if (url) {
                        const pathKey = url.replace('admin/', "").replace(/\//g, "_");
                        translatelist['common']['url'][pathKey] = item.name
                    }
                }
            })
        })
        localStorage.setItem("translate", JSON.stringify(translatelist))
        localStorage.setItem("version", environment.version)
    }
    ChangeMenutranslate(data: any) {
        const translate = JSON.parse(localStorage.getItem("translate"))
        const url = data.url.substring(1, data.url.length)
        if (url) {
            const pathKey = url.replace(/\//g, "_")
            translate['common']['url'][pathKey] = data.name
            localStorage.setItem("translate", JSON.stringify(translate))
        }
    }
    GetMenuTranslate() {
        return new Promise((resolve, reject) => {
            const msgId = this.message.loading('Loading', { nzDuration: 0 }).messageId
            this.request.get(api.menuurl).then(response => {
                resolve(response)
            }).catch(error => {
                this.message.remove(msgId)
                reject(error)
            }).finally(() => {
                this.message.remove(msgId)
            })
        })
    }
}
