import { EventEmitter } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '~/shared/services/app.service';
import { CommonService } from '~/shared/services/http/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StockService } from '~/pages/warehouse/wms/stock/stock.service';
import * as moment from 'moment';

@Component({
    selector: 'out-stock',
    templateUrl: './out.component.html',
    styleUrls: ['./out.component.less']
})
export class OutComponent implements OnInit {

    @Output() editDone = new EventEmitter() 
    width: string
    visible: boolean = false
    validateForm!: FormGroup
    submiting: boolean = false
    tableColumns: any[] = []
    stations: any[] = []
    records: any[] = []
    blsKeys: any[] = []
    allowToSelectOutport = false //是否允许手动指定出货口
    autoSelectOutport = true
    
    constructor(
        private fb: FormBuilder,
        private stockService: StockService,
        private commonService: CommonService,
        private message: NzMessageService,
        private appService: AppService
        ) { }

    ngOnInit() {
        this.tableColumns = this.stockService.outTableColumns()
        this.validateForm = this.fb.group({
            code:    [null, [Validators.required]],
            expected_time: [null],
            remark: [null]
        }) 
        // this.commonService.systemParameter("IsOutTimerOrderly").then(response =>{
        //     if(response == "true"){
        //         this.allowToSelectOutport = true
        //         this.autoSelectOutport = false
        //     }
        // })
    }

    async open(records: any[],stationParams) {  
        const nowTime=moment().format('YYYYMMDDHHmmss');
        this.validateForm = this.fb.group({
            code: [nowTime, [Validators.required]],
        }) 

        let stationType = null
        await this.commonService.systemParameter("OutTimerRoute").then(response =>{
            stationType = response
        })
        this.commonService.structures(Object.assign({blst_group:'In',station_type: stationType},stationParams)).then((response: any) =>{
            this.stations = response
        })
        this.records = JSON.parse(JSON.stringify(records))  
        this.visible = true
    }

    autoSelectOutportChange(value: boolean){
        if(value){
            this.records.forEach(item =>{
                item.out_bls_key =  null
            })
            this.blsKeys = null
        }
    }

    batchSelectPort(value: string[]){
        const length = value.length
        this.records.forEach((item,index) =>{
            const num = length > 0 ? (index % length) : null
            item.out_bls_key =  typeof num == 'number' ? value[num] : null
        })
    }

    delete(index: number){
        if(this.records?.length <= 1){
            this.message.warning(this.appService.translate("lastOneDeleteWarn"))
            return false
        }
        this.records.splice(index,1)
    }
    
    submitForm(event? :KeyboardEvent) {
        if(this.submiting) return false
        
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

            const formData = this.validateForm.value
            for(let i=0; i<this.records.length;i++){
                const item = this.records[i]
                if(!this.autoSelectOutport 
                    && !item.out_bls_key){
                        this.message.warning(this.appService.translate("selectPlaceholder")+'/'+this.appService.translate("stock.outPort"))
                        return false
                    }
                const result = this.stations.find(ite =>ite.key == item.out_bls_key)
                if(result){
                    item.out_bls_code = result.code
                    item.out_bls_name = result.name
                }
                item.sort = i + 1
            }
            formData.storagespaceoutdetaillist = this.records
            if(this.blsKeys?.length > 0){
                formData.bls_keys = this.blsKeys.join(',')
                formData.is_auto_out = true
            }

            if(formData.expected_time){
                formData.expected_time = moment(formData.expected_time).format("YYYY-MM-DD HH:mm:ss")
            }

            this.submiting = true
            this.stockService.save(formData).then(() =>{
                this.editDone.emit()
                this.close()
            }).finally(() =>{
                this.submiting = false
            })
        }
    }

    close(): void {
        this.validateForm.reset()
        this.blsKeys = []
        this.records = []
        this.visible = false
    }

}
