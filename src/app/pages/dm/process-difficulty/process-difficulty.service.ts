import { Injectable } from '@angular/core';
import { AppConfig } from '~/shared/services/AppConfig.service';
import { RequestService } from '~/shared/services/request.service';
import * as moment from 'moment';
@Injectable({
    providedIn: 'root',
})
export class ProcessDifficultyService {
    columnList: any[] = [];

    constructor(private request: RequestService) {
        this.initColumnList();
    }

    initColumnList() {
        const columns = AppConfig.columns.processDifficulty;
        const fields = AppConfig.fields.processDifficulty;
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
                .get(
                    '/admin/OperationDifficulty',
                    params
                )
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
                .post(
                    '/admin/OperationDifficulty/delete',
                    data
                )
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
                .get(
                    `/admin/OperationDifficulty/${key}`
                )
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
                .post(
                    '/Admin/OperationDifficulty',
                    data
                )
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
                    `/public/OperationDifficulty/leadingout`,
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
                .upload(
                    '/Admin/OperationDifficulty/imp',
                    data
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
