import { Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../request.service';

const api = {
  url: '/admin/LayoutStructurePadRelation'
}

@Injectable({
  providedIn: 'root'
})
export class PadRelationService {

    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService,
        ) { }


    list (params = {}) {
        return new Promise((resolve,reject) =>{
            this.request.get(api.url,params).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            })
        })
    }

    update (data,id) {
        data.key = id
        return new Promise((resolve,reject) =>{
            this.request.post(api.url,data).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            })
        })
    }

    tableColumns(){
        return [
            {
                title: this.appService.translate("padrelation.pad_mac"),
                code: "pad_mac"
            },
            {
                title: this.appService.translate("padrelation.Bindblscode"),
                code: "bls_code"
            },
            {
                title: this.appService.translate("padrelation.Bindblsname"),
                code: "bls_name"
            },
            {
                title: this.appService.translate("padrelation.oldsourcestationid"),
                code: "oldsourcestationid",
                tpl: "oldsourcestationidTpl"
            }
        ]
    }
  }
