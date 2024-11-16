import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '~/shared/services/app.service';
import { RequestService } from '~/shared/services/request.service';
import * as moment from "moment"
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class LoginService {
    registerData: any = {};
    registerStatus = -1;
    deadline;

    constructor(
        private request: RequestService,
        private appService: AppService,
        private message: NzMessageService
    ) {}

    checkRegister(data = {}) {
        return new Promise((resolve, reject) => {
            this.request
                .post('register/verifyRegisterTxt', data)
                .then((response) => {
                    this.registerStatus = 1;
                    this.registerData = response;
                    this.deadline = moment(response.expirationtime, "YYYY-MM-DDTHH:mm:ss").diff(moment(new Date()), 'days')
                    // 是否钢带判断从接口里面拿
                    // environment.isGangDai=response.systemname==='WMS'?false:true
                    localStorage.setItem('isGangDai',response.systemname==='IBWMS'?'0':'1')
                    resolve(response);
                })
                .catch((error) => {
                    this.registerStatus = 0;
                    reject(error);
                });
        });
    }

    fecthComputerData() {
        return new Promise((resolve, reject) => {
            this.request
                .get('register/getComputerData')
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    register(data = {}) {
        return new Promise((resolve, reject) => {
            this.request
                .post('register/systemRegister', data)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
