import { EventEmitter } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonService } from '~/shared/services/http/common.service';
import * as moment from "moment"

@Component({
    selector: 'filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.less']
})
export class FilterComponent implements OnInit {

    @Output() editDone = new EventEmitter<any>() 
    @Output() onClose = new EventEmitter() 
    width: string
    visible: boolean = false
    validateForm!: FormGroup
    tagAttributes: any[] = []
    fieldOptions: any[] = []
    valueOptions = {}
    
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        private commonService: CommonService
        ) { }

    ngOnInit() {
        this.validateForm = this.fb.group({
            carrierid: [null],
            date: [null],
            pti_ordercode: [null],
            bls_name: [null],
            bls_code: [null]
        }) 
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if(!result.matches){
                this.width = '340px'
            }else{
                this.width = '100%'
            }
        })
        this.getAttributes()
    }

    getAttributes(){
        this.commonService.attributes({ type: 2 }).then(({fieldOptions, valueOptions}) =>{
            this.fieldOptions = fieldOptions.map(({name,code,key}) =>{
                this.valueOptions[code] = valueOptions[key]
                return {name,key: code}
            })
        })
    }

    open(queryParams:any = {}) {
        this.validateForm.setValue({
            carrierid:          queryParams.carrierid || null,
            date:               queryParams.date || null,
            pti_ordercode:      queryParams.pti_ordercode || null,
            bls_name:           queryParams.bls_name || null,
            bls_code:           queryParams.bls_code || null
        })
        this.tagAttributes = queryParams.tagattributelist || []
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
            const queryParams = this.validateForm.value
            if(queryParams.date?.length > 0){
                queryParams.beginindate = moment(queryParams.date[0]).format("YYYY-MM-DD")
                queryParams.endindate = moment(queryParams.date[1]).format("YYYY-MM-DD")
            }else{
                queryParams.beginindate = null
                queryParams.endindate = null
            }
            this.tagAttributes = this.tagAttributes.filter(({pca_englishname,attribute_value}) =>pca_englishname && attribute_value)
            queryParams.tagattributelist = this.tagAttributes
            this.editDone.emit(queryParams) 
            this.close()
        }
    }

    /* reset(): void {
        this.validateForm.reset()
        const queryParams = this.validateForm.value
        queryParams.beginindate = null
        queryParams.endindate = null
        this.editDone.emit(queryParams) 
        this.close()
    } */

    reset(): void {
        this.validateForm.reset()
        this.tagAttributes = []
    }

    close(){
        this.visible = false 
        this.onClose.emit()
    }
}
