import { Injectable } from '@angular/core';
import { AppConfig } from '~/shared/services/AppConfig.service';
import { RequestService } from '~/shared/services/request.service';

import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { api, AuthService } from '~/shared/services/http/auth.service';
import { GlobalService } from '~/global';
@Injectable({
    providedIn: 'root',
})
export class StructureRuleSchemeService {
    trackTreeChange$ = new Subject<any>();
    trackUnselectChange$ = new Subject<any>();
    trackList$ = new Subject<any>();
    columnList: any[] = [];
    btnGroup = [];

    constructor(
        private request: RequestService,
        public router: Router,
        private authService: AuthService,
        private global:GlobalService
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
        const columns = AppConfig.columns.structureRuleScheme;
        const fields = AppConfig.fields.structureRuleScheme;
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
                .get('/admin/LayoutStructureSchemeRules', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchSchemeConditionDetail(params) {
        return new Promise((resolve, reject) => {
            this.request
                .get('/admin/LayoutStructureSchemeRulesDetail/getlist', params)
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
                .post('/admin/LayoutStructureSchemeRules/delete', data)
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
                .post('/admin/LayoutStructureSchemeRules', data)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchTrackList(params = {}) {
        return new Promise((resolve, reject) => {
            this.request
                .get('/admin/LayoutStructure/extend/NewGetList', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchSelectedTrackList(key) {
        return new Promise((resolve, reject) => {
            this.request
                .get(`/admin/LayoutStructureScheme/getlist?blsr_key=${key}`)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    deleteTrack(data) {
        return new Promise((resolve, reject) => {
            this.request
                .post('/admin/LayoutStructureScheme/delete', data)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    addTrack(data) {
        return new Promise((resolve, reject) => {
            this.request
                .post('/admin/LayoutStructureScheme', data)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
