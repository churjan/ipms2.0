import { Injectable } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { AppService } from "~/shared/services/app.service";
import { RequestService } from "~/shared/services/request.service";

@Injectable({
    providedIn: 'root'
})
export class ZSelectService {
    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService
    ) { }

    //获取数据
    getList (url,params = {}) {
        return new Promise((resolve,reject) =>{
            this.request.get(url,params).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            })
        })
    }
}