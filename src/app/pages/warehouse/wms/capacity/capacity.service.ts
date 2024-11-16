import { Injectable } from '@angular/core';
import { AppService } from '../../../../shared/services/app.service';
import { RequestService } from '../../../../shared/services/request.service';

const api = {
  url: '/admin/layoutstructure/extend/getstationcapacity'
}

@Injectable({
  providedIn: 'root'
})
export class CapacityService {

    constructor(
        private request: RequestService,
        private appService: AppService
        ) { }


    list (data:any = {}) {
        return new Promise((resolve,reject) =>{
            this.request.post(api.url,data).then(response =>{
                let result = []
                if(response?.length > 0){
                    response.forEach(item =>{
                        if(item.totalcapacity > 0){
                            item.used_rate = Math.round((item.occupiedcapacity/item.totalcapacity) * 100)
                        }else{
                            item.used_rate = 0
                        }
                    })
                    result = response
                    if(data.keywords){
                        result = response.filter(({stationname,stationcode}) =>{
                            if(stationname.indexOf(data.keywords) >= 0 
                                || stationcode.indexOf(data.keywords) >= 0){
                                    return true
                            }else{
                                return false
                            }
                        })
                    }
                }
                resolve({
                    total: result.length,
                    data: result
                })
            }).catch(error =>{
                reject(error)
            })
        })
    }

    tableColumns(){
        return [
            {
                title: this.appService.translate("capacity.bls_name"),
                code: "stationname"
            },
            {
                title: this.appService.translate("capacity.bls_code"),
                code: "stationcode"
            },
            {
                title: this.appService.translate("capacity.total"),
                code: "totalcapacity"
            },
            {
                title: this.appService.translate("capacity.used"),
                code: "occupiedcapacity"
            },
            {
                title: this.appService.translate("capacity.surplus"),
                code: "surpluscapacity"
            },
            {
                title: this.appService.translate("capacity.usedRate"),
                code: "used_rate",
                tpl: "progressTpl"
            }
        ]
    }
}
