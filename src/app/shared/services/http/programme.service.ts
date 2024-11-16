import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';
import { RequestService } from '../request.service';

const api = {
    url: '/admin/shuntschemeinfo',
    stations: '/admin/layoutstructureshuntscheme/getlist',
};

@Injectable({
    providedIn: 'root',
})
export class ProgrammeService {
    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService
    ) {}

    list(params = {}) {
        return new Promise((resolve, reject) => {
            this.request
                .get(api.url, params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    get(id) {
        const msgId = this.message.loading(
            this.appService.translate('dataLoading'),
            { nzDuration: 0 }
        ).messageId;
        return new Promise((resolve, reject) => {
            this.request
                .get(api.url + '/' + id)
                .then((response) => {
                    const data = {
                        name: response.name || null,
                        description: response.description || null,
                        conditions: response.conditions.map((item) => {
                            return {
                                field: item.field,
                                operator: item.operator,
                                value: item.value,
                                key: item.key,
                            };
                        }),
                    };
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                })
                .finally(() => {
                    this.message.remove(msgId);
                });
        });
    }

    add(data) {
        const msgId = this.message.loading(
            this.appService.translate('dataSaving'),
            { nzDuration: 0 }
        ).messageId;
        return new Promise((resolve, reject) => {
            this.request
                .post(api.url, data)
                .then((response) => {
                    this.message.success(
                        response?.message ||
                            this.appService.translate('saveSuccess')
                    );
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                })
                .finally(() => {
                    this.message.remove(msgId);
                });
        });
    }

    update(data, id) {
        data.key = id;
        const msgId = this.message.loading(
            this.appService.translate('dataSaving'),
            { nzDuration: 0 }
        ).messageId;
        return new Promise((resolve, reject) => {
            this.request
                .post(api.url, data)
                .then((response) => {
                    this.message.success(
                        response?.message ||
                            this.appService.translate('saveSuccess')
                    );
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                })
                .finally(() => {
                    this.message.remove(msgId);
                });
        });
    }

    del(data) {
        const msgId = this.message.loading(
            this.appService.translate('dataDeleting'),
            { nzDuration: 0 }
        ).messageId;
        return new Promise((resolve, reject) => {
            this.request
                .post(api.url + '/delete', data)
                .then((response) => {
                    this.message.success(
                        response?.message ||
                            this.appService.translate('deleteSuccess')
                    );
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                })
                .finally(() => {
                    this.message.remove(msgId);
                });
        });
    }

    stations(params) {
        return new Promise((resolve, reject) => {
            this.request
                .get(api.stations, params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    tableColumns() {
        return [
            {
                title: this.appService.translate('name'),
                code: 'name',
            },
            {
                title: this.appService.translate('description'),
                code: 'description',
            },
        ];
    }

    stationTableColumns() {
        return [
            {
                title: this.appService.translate('blsName'),
                code: 'bls_name',
                align: 'center',
            },
            {
                title: this.appService.translate('blsCode'),
                code: 'bls_code',
                align: 'center',
            },
        ];
    }

    fetchAllStationList(params) {
        return new Promise((resolve, reject) => {
            this.request
                .get('/admin/layoutstructure/getlist?blst_group=In', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchSelectedStationList(params) {
        return new Promise((resolve, reject) => {
            this.request
                .get('/admin/layoutstructureshuntscheme/getlist', params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    addStationList(data) {
        return new Promise((resolve, reject) => {
            this.request
                .post('/admin/layoutstructureshuntscheme/extend/savelayoutstructureshuntscheme', data)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    deleteStationList(data) {
        return new Promise((resolve, reject) => {
            this.request
                .post('/admin/layoutstructureshuntscheme/delete', data)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
