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
    fieldOptions: any[] = []
    filterFilds: any[] = []
    valueOptions = {}
    queryParams:any = {}
    DateMode:any='0'
    date=null
    
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        private commonService: CommonService
        ) { }

     ngOnInit() {
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

     open(filterFilds:any[] = [],queryParams:any = {}) {
        this.getAttributes()
        this.filterFilds=filterFilds
        this.queryParams=queryParams
        this.filterFilds.forEach(item=>{
            item.value=queryParams[item.englishname]
        })
        this.visible = true
    }
    
    submitForm(event? :KeyboardEvent) {
        if(!event || event.key == "Enter"){  
            const queryParams = this.queryParams
            queryParams.DateMode=this.DateMode
            queryParams.searchstatisticslist=[]
            this.filterFilds.forEach(item=>{
                queryParams[item.englishname]=item.value
                queryParams.searchstatisticslist.push({
                    SearchKey:item.englishname,
                    Value:item.value
                })
            })
            if(this.date?.length > 0){
                queryParams.start_time = moment(this.date[0]).format("YYYY-MM-DD")
                queryParams.end_time = moment(this.date[1]).format("YYYY-MM-DD")
                queryParams.date=this.date
            }else{
                queryParams.start_time = null
                queryParams.end_time = null
            }
            this.editDone.emit(queryParams) 
            this.close()
        }
    }

    reset(): void {
        this.DateMode='0'
        this.date=null
        this.queryParams = {}
    }

    close(){
        this.visible = false 
        this.onClose.emit()
    }
}
