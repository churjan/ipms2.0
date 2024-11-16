import { Injectable } from '@angular/core';
import { RequestService } from '~/shared/services/request.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SkuProcessService {

  subscription$ = new Subject();

  constructor(private request: RequestService) {}

  fetchSkuList(params = {}) {
    return new Promise((resolve, reject) => {
      this.request
        .get('admin/skuOperationProcess/extend/GetAll', params)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  saveSkuProcess(params = {}) {
    return new Promise((resolve, reject) => {
      this.request
        .post('admin/skuOperationProcess', params)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  viewSkuProcess(key) {
    return new Promise((resolve, reject) => {
      this.request
        .get('admin/skuOperationProcess/' + key)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 获取工段和款式
  fetchWorkSectionAndPart(params = {}) {
    return new Promise((resolve, reject) => {
      this.request
        .get('SystemInfo/getoperationprocessconfig', params)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
