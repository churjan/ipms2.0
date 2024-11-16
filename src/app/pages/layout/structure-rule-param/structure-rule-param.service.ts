import { Injectable } from '@angular/core';
import { AppConfig } from '~/shared/services/AppConfig.service';
import { RequestService } from '~/shared/services/request.service';
import { Router } from '@angular/router';
import { AuthService } from '~/shared/services/http/auth.service';
import { GlobalService } from '~/global';
const api = {
    userMenu: '/admin/system/extend/menu/',
}
@Injectable({
    providedIn: 'root',
})
export class StructureRuleParamService {
    columnList: any[] = [];
    btnGroup = [];

    constructor(
        private request: RequestService,
        public router: Router,
        private authService: AuthService,
        private global: GlobalService
    ) {
        this.initColumnList();
        let url = this.router.url.replace(/\//g, '_');
        if (url.indexOf('_') == 0) {
            url = url.substring(1, url.length);
        }
        if(this.global.munuList.length>0){
            const rawbtnGroup = this.authService.getBtnZAll(this.global.munuList,url);
            let tempArr = [];
            Object.keys(rawbtnGroup).forEach((key) => tempArr.push(...rawbtnGroup[key]));
            this.btnGroup = [...new Set(tempArr)];
        }else{
            this.request.get(api.userMenu).then(response => {
                // response;
                let menuData = response;
                this.global.munuList = menuData;
                const rawbtnGroup = this.authService.getBtnZAll(menuData,url);
                let tempArr = [];
                Object.keys(rawbtnGroup).forEach((key) => tempArr.push(...rawbtnGroup[key]));
                this.btnGroup = [...new Set(tempArr)];
            }).catch(()=>{
                let menuData = [];
                this.global.munuList = menuData;
                const rawbtnGroup = this.authService.getBtnZAll(menuData,url);
                let tempArr = [];
                Object.keys(rawbtnGroup).forEach((key) => tempArr.push(...rawbtnGroup[key]));
                this.btnGroup = [...new Set(tempArr)];
            })
        }
    }

    btnAuth(actionName) {
        return this.btnGroup.find((item) => item.action === actionName);
    }

    initColumnList() {
        const columns = AppConfig.columns.layoutProgramme;
        const fields = AppConfig.fields.layoutProgramme;
        columns.forEach((item) => {
            const flag = fields.find((item2) => item2.code === item);
            if (flag) {
                this.columnList.push(flag);
            }
        });
    }

    fetchList(params) {
        return new Promise((resolve, reject) => {
            this.request
                .get('/admin/LayoutStructureRules', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    save(data) {
        return new Promise((resolve, reject) => {
            this.request
                .post('/admin/LayoutStructureRules', data)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    delete(data) {
        return new Promise((resolve, reject) => {
            this.request
                .post('/admin/LayoutStructureRules/delete', data)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    detail(key) {
        return new Promise((resolve, reject) => {
            this.request
                .get(`/admin/LayoutStructureRules/${key}`)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
