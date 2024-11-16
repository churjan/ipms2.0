import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../../../../shared/services/app.service';
import { RequestService } from '../../../../shared/services/request.service';
import { CommonService } from '../../../../shared/services/http/common.service';

const api = {
    url: '/admin/systemlog'
}

@Injectable({
    providedIn: 'root'
})
export class RunLogService {

    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private commonService: CommonService,
        private appService: AppService
        ) { }


    list (params = {}) {
        return new Promise((resolve,reject) =>{
            this.request.get(api.url+"/getlist",params).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            })
        })
    }

    batchPull (data) {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.post(api.url+'/extend/uploadpadlog',data).then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    tree () {
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get('/admin/layoutstructure/extend/gettreelist',{BLST_Group: "Line,Station"}).then(response =>{
                resolve(this.reBuildData(response))
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
    }

    reBuildData(data){
        if(!data || data.length <= 0) return []
        return data.map(item =>{
            const temp = {
                key: item.key,
                title: item.name,
                children: [],
                isLeaf: true
            }
            if(item.sonlist 
                && item.sonlist.length > 0){
                temp.children = this.reBuildData(item.sonlist)
                temp.isLeaf = false
            }
            return temp
        })
    }

    download(path: string){
        const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
        return new Promise((resolve,reject) =>{
            this.request.get(this.commonService.baseUrl+path,{},'arraybuffer').then(response =>{
                resolve(response)
            }).catch(error =>{
                reject(error)
            }).finally(() =>{
                this.message.remove(msgId)
            })
        })
        
    }
}
