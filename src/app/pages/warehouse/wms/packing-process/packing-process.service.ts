import { Injectable } from '@angular/core';
import { RequestService } from '~/shared/services/request.service';

@Injectable({
  providedIn: 'root',
})
export class PackingProcessService {
  constructor(private request: RequestService) {}

  fetchStationList(params) {
    return new Promise((resolve, reject) => {
      this.request
        .get('/admin/w_LayoutStructure/getlist', params)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  judgeIsSame(key) {
    return new Promise((resolve, reject) => {
      this.request
        .get('/admin/baozhuangdetail/' + key)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  fetchPackingProcessInfo(params) {
    return new Promise((resolve, reject) => {
      this.request
        .get('/admin/baozhuangtaginfo', params)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  fetchPackingProcessTable(params) {
    return new Promise((resolve, reject) => {
      this.request
        .get('/admin/baozhuangtaginfo/extend/boxdetail', params)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  fetchPackingschedule(params) {
    return new Promise((resolve, reject) => {
      this.request
        .get('/admin/baozhuangschedule/getlist', params)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  fetchPackingBoxDetail(params) {
    return new Promise((resolve, reject) => {
      this.request
        .get('/admin/baozhuangboxDetailschedule/getlist', params)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 站位产量
  fetchStationSum(params) {
    return new Promise((resolve, reject) => {
      this.request
        .get('/admin/Report/CustomProductionReport/GetPageList/', params)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  fetchStationStatus(bls_key) {
    return new Promise((resolve, reject) => {
      this.request
        .get('/admin/LayoutStructure/' + bls_key)
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

  // 确认缺件
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
}
