import { Injectable } from '@angular/core';
import { AppConfig } from '~/shared/services/AppConfig.service';
import { RequestService } from '~/shared/services/request.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { api, AuthService } from '~/shared/services/http/auth.service';
import { GlobalService } from '~/global';
@Injectable({
    providedIn: 'root',
})
export class ProductionEquipmentService {
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
        const columns = AppConfig.columns.productionEquipment;
        const fields = AppConfig.fields.productionEquipment;
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
                .get('/admin/machinedeviceinfo', params)
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
                .post('/admin/machinedeviceinfo/delete', data)
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
                .get(`/admin/machinedeviceinfo/${key}`)
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
                .post('/Admin/machinedeviceinfo', data)
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
                    `/public/machinedeviceinfo/leadingout`,
                    params,
                    'arraybuffer'
                )
                .then((data: ArrayBuffer) => {
                    const fileLink = document.createElement('a');
                    const blobObj = new Blob([data], {
                        type: 'application/vnd.ms-excel;charset=utf-8',
                    });
                    fileLink.href = window.URL.createObjectURL(blobObj);
                    // const fileName =
                    //     moment(new Date()).format('YYYY-MM-DD HH:mm:ss') +
                    //     '.xls';
                    const fileName = 'machinedeviceinfoExport.xls';
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
                .upload('/Admin/machinedeviceinfo/imp', data)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
