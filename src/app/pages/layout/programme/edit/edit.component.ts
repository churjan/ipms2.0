import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ProgrammeService } from '~/shared/services/http/programme.service';
import { CommonService } from '~/shared/services/http/common.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppService } from '~/shared/services/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ConditionsComponent } from './conditions/conditions.component';

@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {

    @ViewChild('conditions') conditionsEle : ConditionsComponent
    @Output() editDone = new EventEmitter<boolean>() 
    title: string
    width: string
    visible: boolean = false

    validateForm: any
    submiting: boolean = false
    key: string
    fieldOptions: Array<any>
    valueOptions: any

    constructor(
        private programmeService: ProgrammeService,
        private commonService:CommonService,
        private breakpointObserver: BreakpointObserver,
        private message: NzMessageService,
        private appService: AppService
        ) { }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if(!result.matches){
                this.width = '1000px'
            }else{
                this.width = '100%'
            }
        })
        this.initForm()
    }

    async open(record: any) {
        await this.commonService.attributes({showtype:'LayoutScheme'},'attribute_rule').then((response: any) =>{
            this.fieldOptions = response.fieldOptions
            this.valueOptions = response.valueOptions
        })
        this.title = record ? this.appService.translate("update") : this.appService.translate("add")
        if(record){
            this.key = record.key
            this.programmeService.get(this.key).then((response: any) =>{
                this.validateForm = response
                this.validateForm.conditions.forEach(item=>{
                    var fieldOption=this.fieldOptions.find(x=>x.key==item.field)
                    if(fieldOption)
                    item.optionmode=fieldOption.optionmode
                })
            })
        }else{
            this.key = null
        }
        this.visible = true
    }
    
    submitForm(event? :KeyboardEvent) {

        if(this.submiting) return false
        
        if(!event || event.key == "Enter"){

            if(!this.validateForm.name){
                this.message.warning(this.appService.translate("programme.nameEmptyWarn"))
                return false
            }
            if(this.validateForm.description?.length > 100){
                this.message.warning(this.appService.translate("descriptionLengthWarn"))
                return false
            }
            if(!this.conditionsEle.verify()) return false
            
            this.submiting = true
            this.appService.formSubmit(null,this.programmeService,this.key,this.validateForm).then(() =>{
                this.editDone.emit(this.key ? false : true)
                this.close()
            }).finally(() =>{
                this.submiting = false
            })
        }
    }

    close(): void {
        this.visible = false
        this.initForm()
    }

    initForm(){
        this.validateForm = {
            name: null,
            conditions: [
                {
                    field: null,
                    operator: null,
                    value: null,
                    key: null
                }
            ],
            description: null
        }
    }
}
