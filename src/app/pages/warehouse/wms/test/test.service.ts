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
}
