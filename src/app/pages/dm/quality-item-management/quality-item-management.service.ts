import { Injectable } from '@angular/core';
import { AppConfig } from '~/shared/services/AppConfig.service';
import { RequestService } from '~/shared/services/request.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { api, AuthService } from '~/shared/services/http/auth.service';
import { GlobalService } from '~/global';
@Injectable({
    providedIn: 'root',
})
export class QualityItemManagementService {
    columnList: any[] = [];
    catalogChange$ = new Subject<any>();
    btnGroup = [];

    constructor(
        private request: RequestService,
        public router: Router,
        private authService: AuthService,
        private global:GlobalService
    ) {
        // this.initColumnList();
        // let url = this.router.url.replace(/\//g, '_');
        // if (url.indexOf('_') == 0) {
        //     url = url.substring(1, url.length);
        // }

        // if(this.global.munuList.length>0){
        //     const rawbtnGroup = this.authService.getBtnZAll(this.global.munuList,url);
        //     let tempArr = [];
        //     Object.keys(rawbtnGroup).forEach((key) => tempArr.push(...rawbtnGroup[key]));
        //     this.btnGroup = [...new Set(tempArr)];
        // }else{
        //     this.request.get(api.userMenu).then(response => {
        //         // response;
        //         let menuData = response;
        //         this.global.munuList = menuData;
        //         const rawbtnGroup = this.authService.getBtnZAll(menuData,url);
        //         let tempArr = [];
        //         Object.keys(rawbtnGroup).forEach((key) => tempArr.push(...rawbtnGroup[key]));
        //         this.btnGroup = [...new Set(tempArr)];
        //     }).catch(()=>{
        //         let menuData = [];
        //         this.global.munuList = menuData;
        //         const rawbtnGroup = this.authService.getBtnZAll(menuData,url);
        //         let tempArr = [];
        //         Object.keys(rawbtnGroup).forEach((key) => tempArr.push(...rawbtnGroup[key]));
        //         this.btnGroup = [...new Set(tempArr)];
        //     })
        // }
    }

    btnAuth(actionName) {
        return this.btnGroup.find((item) => item.action === actionName);
    }

    initColumnList() {
        const columns = AppConfig.columns.qualityItemManagement;
        const fields = AppConfig.fields.qualityItemManagement;
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
                .get('/admin/QualityCauseInfo', params)
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
                .post('/admin/QualityCauseInfo/delete', data)
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
                .get(`/admin/QualityCauseInfo/${key}`)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    edit(data) {
        return new Promise((resolve, reject) => {
            this.request
                .post('/Admin/QualityCauseInfo', data)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    export(params) {
        return new Promise((resolve, reject) => {
            this.request
                .get(
                    `/public/QualityCauseInfo/leadingout`,
                    params,
                    'arraybuffer'
                )
                .then((data: ArrayBuffer) => {
                    const fileLink = document.createElement('a');
                    const blobObj = new Blob([data], {
                        type: 'application/vnd.ms-excel;charset=utf-8',
                    });
                    fileLink.href = window.URL.createObjectURL(blobObj);
                    const fileName =
                        moment(new Date()).format('YYYY-MM-DD HH:mm:ss') +
                        '.xls';
                    fileLink.setAttribute('download', fileName);
                    fileLink.click();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    import(data) {
        return new Promise((resolve, reject) => {
            this.request
                .upload('/Admin/QualityCauseInfo/imp', data)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchCatalog() {
        return new Promise((resolve, reject) => {
            this.request
                .get('/admin/QualityCauseClass/getlist')
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchQualityList() {
        return new Promise((resolve, reject) => {
            this.request
                .get('/admin/QualityCauseInfo?page=1&pagesize=99999')
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchOperationList(params) {
        return new Promise((resolve, reject) => {
            this.request
                .get('/admin/OperationClass/getlist', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchSelectedOperationList(key) {
        return new Promise((resolve, reject) => {
            this.request
                .get(
                    `/admin/OperationClassQualityCauseRelation/GetList?bqci_key=${key}`
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    addSetting(data) {
        return new Promise((resolve, reject) => {
            this.request
                .post(`/admin/OperationClassQualityCauseRelation`, data)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    deleteSetting(data) {
        return new Promise((resolve, reject) => {
            this.request
                .post(`/admin/OperationClassQualityCauseRelation/delete`, data)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchQualityClassOption() {
        return new Promise((resolve, reject) => {
            this.request
                .get('/admin/QualityCauseClass/option')
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    editQualityClass(data) {
        return new Promise((resolve, reject) => {
            this.request
                .post('/admin/QualityCauseClass', data)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    deleteQualityClass(data) {
        return new Promise((resolve, reject) => {
            this.request
                .post('/admin/QualityCauseClass/delete', data)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
