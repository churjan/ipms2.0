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
    //attributesSeleteItems: Array<any>
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
            tagcode: [null],
            customcode: [null],
            salesorderid: [null],
            ordercode: [null],
            state: [null],
            date: [null],
            //tagattributelist: [null]
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
        this.commonService.attributes({type: 2}).then(({fieldOptions, valueOptions}) =>{
            this.fieldOptions = fieldOptions.map(({name,code,key}) =>{
                this.valueOptions[code] = valueOptions[key]
                return {name,key: code}
            })
            /* const result = []
            if(fieldOptions){
                fieldOptions.forEach(item =>{
                    const group = {
                        title: item.name,
                        items: []
                    }
                    if(valueOptions[item.key]){
                        valueOptions[item.key].forEach(ite =>{
                            group.items.push({
                                title: ite.name,
                                value: {
                                    pca_englishname: item.code,
                                    attribute_value: ite.key
                                }
                            })
                        })
                    }
                    result.push(group)
                })
            }
            this.attributesSeleteItems = result */
        })
    }


    open(queryParams:any = {}) {
        this.validateForm.setValue({
            tagcode:        queryParams.tagcode || null,
            customcode:     queryParams.customcode || null,
            salesorderid:   queryParams.salesorderid || null,
            ordercode:      queryParams.ordercode || null,
            state:          typeof queryParams.state == 'number' ? queryParams.state : null,
            date:           queryParams.date || null,
            //tagattributelist:   queryParams.tagattributelist || null
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
                queryParams.start_time = moment(queryParams.date[0]).format("YYYY-MM-DD")
                queryParams.end_time = moment(queryParams.date[1]).format("YYYY-MM-DD")
            }else{
                queryParams.start_time = null
                queryParams.end_time = null
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
        queryParams.start_time = null
        queryParams.end_time = null
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
