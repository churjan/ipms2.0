import { Injectable } from '@angular/core';
import { RequestService } from '~/shared/services/request.service';

@Injectable({
    providedIn: 'root',
})
export class PackingSolutionService {
    constructor(private request: RequestService) {}

    fetchBoxList(params = {}) {
        return new Promise((resolve, reject) => {
            this.request
                .get('/admin/baozhuangbox/getlist', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    modifyLevel(params) {
        return new Promise((resolve, reject) => {
            this.request
                .post('/admin/baozhuang/extend/changelevel', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    modifyStatus(params) {
        return new Promise((resolve, reject) => {
            this.request
                .post('/admin/baozhuang/extend/changestatus', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    confirmLackPart(params) {
        return new Promise((resolve, reject) => {
            this.request
                .post('/admin/baozhuangdetail/extend/filter', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    confirmMakeout(params) {
        return new Promise((resolve, reject) => {
            this.request
                .post('/admin/baozhuang/extend/makeout', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    // 打印不干胶
    printSuit(params) {
        return new Promise((resolve, reject) => {
            this.request
                .post('/admin/baozhuangtaginfo/extend/printsuit', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    // 打印箱贴
    printBox(params) {
        return new Promise((resolve, reject) => {
            this.request
                .post('/admin/baozhuangtaginfo/extend/printbox', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    // 获取包装方案未排序列表
    fetchPackingList(params = {}) {
        return new Promise((resolve, reject) => {
            this.request
                .get('/admin/baozhuang/extend/getsortlist', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    sortPackingList(params = {}) {
        return new Promise((resolve, reject) => {
            this.request
                .post('/admin/baozhuang/extend/changesort', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
