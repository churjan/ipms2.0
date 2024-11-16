import { EventEmitter } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StockService } from '~/pages/warehouse/wms/stock/stock.service';
import { AppService } from '~/shared/services/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'num-stock',
    templateUrl: './num.component.html',
    styleUrls: ['./num.component.less']
})
export class NumComponent implements OnInit {

    @Output() editDone = new EventEmitter<any>() 
    width: string
    visible: boolean = false
    validateForm!: FormGroup
    blsKey: string = null
    queryByParams:object=null

    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        private message: NzMessageService,
        private stockService: StockService,
        private appService: AppService
        ) { }

    ngOnInit() {
        this.validateForm = this.fb.group({
            quantity: [null, [Validators.required]]
        }) 
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if(!result.matches){
                this.width = '300px'
            }else{
                this.width = '100%'
            }
        })
    }

    open(blsKey: string,queryByParams:object) {
        this.blsKey = blsKey
        this.queryByParams=queryByParams
        this.visible = true
    }
    
    submitForm(event? :KeyboardEvent) {
        if(!event || event.key == "Enter"){
            for(let key in this.validateForm.value){
                if(typeof this.validateForm.value[key] == 'string'){
                    const temp = {}
                    temp[key] = this.validateForm.value[key].trim()
                    this.validateForm.patchValue(temp)
                }
            }
            for (const i in this.validateForm.controls) {
                if (this.validateForm.controls.hasOwnProperty(i)) {
                    this.validateForm.controls[i].markAsDirty()
                    this.validateForm.controls[i].updateValueAndValidity()
                }
            }
            if (!this.validateForm.valid) {
                return false
            }

            const formData: any = this.validateForm.value

            const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
           let _queryByParams={}
           Object.assign(_queryByParams,this.queryByParams);
           _queryByParams = Object.assign(_queryByParams, {page: 1,pageSize:formData.quantity,isFrozen:false}) 
            this.stockService.list(_queryByParams).then(({data}) => {
                if(data.length <= 0){
                    this.message.warning(this.appService.translate("stock.emptyData"))
                    return false
                }
                if(data.length < formData.quantity){
                    this.message.warning(this.appService.translate("stock.maxDataNum")+' : '+data.length)
                    return false
                }
                this.editDone.emit(data)
                this.close()
            }).finally(() =>{
                this.message.remove(msgId)
            })
        }
    }

    close(): void {
        this.validateForm.reset()
        this.visible = false
    }

}
