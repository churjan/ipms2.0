import { Injectable } from '@angular/core';
import { RequestService } from '~/shared/services/request.service';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor(private request: RequestService) {}

  fetchData(key) {
    return new Promise((resolve, reject) => {
      this.request
        .get('admin/Report/w_CustomWarehouseInventoryReport/' + key)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  fetchDynamicFields() {
    return new Promise((resolve, reject) => {
      this.request
        .get('/admin/LayoutStructureRules/getlist?Module=5')
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  submitData(data) {
    return new Promise((resolve, reject) => {
      this.request
        .post('/admin/w_WarehouseOutTask/extend/save',data)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
