import { Injectable } from '@angular/core';
import { RequestService } from '~/shared/services/request.service';
import { Subject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class LayoutStructureManagementService {
    catalogChange$ = new Subject<any>();
    tabChange$ = new Subject<any>();

    constructor(private request: RequestService) {}

    fetchCatalog() {
        return new Promise((resolve, reject) => {
            this.request
                .get(
                    '/admin/LayoutStructure/getlist'
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchBridgeInfo(key) {
        return new Promise((resolve, reject) => {
            this.request
                .get(
                    `/admin/BridgeInfo/getlist?bls_key=${key}`
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
                    `/admin/LayoutStructure/${key}`
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchTabletList() {
        return new Promise((resolve, reject) => {
            this.request
                .get(
                    `/admin/classdata/getlist?pcode=padmoudle`
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchSelectedTabletList(bls_key) {
        return new Promise((resolve, reject) => {
            this.request
                .get(
                    `/admin/PadModule/getlist?bls_key=${bls_key}`
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    deleteTabletList(data) {
        return new Promise((resolve, reject) => {
            this.request
                .post(
                    `/admin/PadModule/delete`,
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

    addTabletList(data) {
        return new Promise((resolve, reject) => {
            this.request
                .post(`/admin/PadModule`, data)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchMachineDeviceList(params) {
        return new Promise((resolve, reject) => {
            this.request
                .get(
                    `/admin/MachineDeviceInfo`,params
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchSelectedMachineDeviceList(params) {
        return new Promise((resolve, reject) => {
            this.request
                .get(
                    `/admin/LayoutStructureMachineDeviceRelation/getlist`,params
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    addMachineDevice(data) {
        return new Promise((resolve, reject) => {
            this.request
                .post(
                    `/admin/LayoutStructureMachineDeviceRelation`,data
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    deleteMachineDevice(data) {
        return new Promise((resolve, reject) => {
            this.request
                .post(
                    `/admin/LayoutStructureMachineDeviceRelation/delete`,data
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchRuleSettingList(params) {
        return new Promise((resolve, reject) => {
            this.request
                .get(
                    `/admin/LayoutStructureSchemeRules/getlist`,params
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchSelectedRuleSettingList(params) {
        return new Promise((resolve, reject) => {
            this.request
                .get(
                    `/admin/LayoutStructureScheme/getlist`,params
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    addRuleSetting(data) {
        return new Promise((resolve, reject) => {
            this.request
                .post(
                    `/admin/LayoutStructureScheme`,data
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    deleteRuleSetting(data) {
        return new Promise((resolve, reject) => {
            this.request
                .post(
                    `/admin/LayoutStructureScheme/delete`,data
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchWorkStationList(params) {
        return new Promise((resolve, reject) => {
            this.request
                .get(
                    `/admin/Operationinfo`,params
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    fetchSelectedWorkStationList(params) {
        return new Promise((resolve, reject) => {
            this.request
                .get(
                    `/admin/OperationStructureRelation/getlist`,params
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    adddWorkStation(data) {
        return new Promise((resolve, reject) => {
            this.request
                .post(
                    `/admin/OperationStructureRelation`,data
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    deletedWorkStation(data) {
        return new Promise((resolve, reject) => {
            this.request
                .post(
                    `/admin/OperationStructureRelation/delete`,data
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }


    reload() {
        return new Promise((resolve, reject) => {
            this.request
                .post(
                    `/admin/LayoutStructure/extend/UpdataByPlatform`
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    setTablet(data){
        return new Promise((resolve, reject) => {
            this.request
                .post(
                    `/admin/padmodule/extend/BatchSavePadModule`,data
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    //获取线位数据 http://172.16.105.78:5001/api
    getLine(params={}){
        return new Promise((resolve, reject) => {
            this.request.get('/admin/LayoutStructure/extend/NewGetList', params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //软满(容量)查询
    getCapacity(params={}){
        return new Promise((resolve, reject) => {
            this.request.get('/admin/layoutstructure/volume', params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //进轨配置
    upCapacity(params={}){
        return new Promise((resolve, reject) => {
            this.request.post('/admin/layoutstructure/volume', params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }

    //线配置
    upAllCapacity(params={}){
        return new Promise((resolve, reject) => {
            this.request.post('/admin/layoutstructure/volume/line', params).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }
}
